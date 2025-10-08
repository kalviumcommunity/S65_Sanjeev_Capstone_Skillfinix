const Conversation = require("../Models/Conversation.js");
const User = require("../Models/User.js");
const Message = require("../Models/Message.js"); // 🔥 ADD THIS IMPORT
const {
  getAiResponse,
  sendMessageHandler,
  deleteMessageHandler,
} = require("../Controllers/message_controller.js");

module.exports = (io, socket) => {
  let currentUserId = null;

  // Setup user in a room
  socket.on("setup", async (id) => {
    currentUserId = id;
    socket.join(id);
    console.log("User joined personal room", id);
    socket.emit("user setup", id);

    // change isOnline to true
    await User.findByIdAndUpdate(id, { isOnline: true });

    const conversations = await Conversation.find({
      members: { $in: [id] },
    });

    conversations.forEach((conversation) => {
      const sock = io.sockets.adapter.rooms.get(conversation.id);
      if (sock) {
        console.log("Other user is online is sent to: ", id);
        io.to(conversation.id).emit("receiver-online", {});
      }
    });
  });

  // Join chat room
  socket.on("join-chat", async (data) => {
    const { roomId, userId } = data;
    console.log("User joined chat room", roomId);
    try {
      const conv = await Conversation.findById(roomId);
      socket.join(roomId);

      // set joined user unread to 0
      if (conv && conv.unreadCounts) {
        conv.unreadCounts = conv.unreadCounts.map((unread) => {
          if (unread.userId.toString() === userId.toString()) {
            unread.count = 0;
          }
          return unread;
        });
        await conv.save({ timestamps: false });
      }

      io.to(roomId).emit("user-joined-room", userId);
    } catch (error) {
      console.error("Error joining chat room:", error);
    }
  });

  // Leave chat room
  socket.on("leave-chat", (room) => {
    console.log("User left chat room:", room);
    socket.leave(room);
  });

  // 🔥 FIXED Send Message Handler - Now saves user messages to database
  const handleSendMessage = async (data) => {
    console.log("Received message:", data);
    let isSentToBot = false;
    const { conversationId, senderId, text, imageUrl } = data;

    try {
      const conversation = await Conversation.findById(conversationId).populate(
        "members"
      );

      if (!conversation) {
        console.error("Conversation not found:", conversationId);
        return;
      }

      // Processing for AI chatbot using for...of loop instead of forEach
      for (const member of conversation.members) {
        if (
          member._id.toString() !== senderId.toString() &&
          member.email &&
          member.email.includes("bot")
        ) {
          // this member is a bot
          isSentToBot = true;
          console.log("Message sent to bot:", member.email);

          // 🔥 CRITICAL FIX: Save user message to database FIRST
          console.log("Creating user message in database...");
          const userMessage = await Message.create({
            conversationId,
            senderId,
            text,
            imageUrl,
            seenBy: [{ user: senderId, seenAt: new Date() }],
          });
          console.log("User message created successfully:", userMessage._id);

          // Emit the REAL user message (not mock)
          console.log("Emitting user message:", userMessage._id);
          io.to(conversationId).emit("receive-message", userMessage);

          // Send typing event
          io.to(conversationId).emit("typing", {
            typer: member._id.toString(),
          });

          // Get AI response
          console.log("Getting AI response...");
          const responseMessage = await getAiResponse(
            text,
            senderId,
            conversationId
          );

          if (responseMessage && responseMessage !== -1) {
            // Emit AI response
            console.log("Emitting AI response:", responseMessage._id);
            io.to(conversationId).emit("receive-message", responseMessage);
          } else {
            console.error("Failed to get AI response");
            
            // 🔥 Create and save error message to database
            const helpfulMessage = await Message.create({
              conversationId,
              senderId: member._id,
              text: "Hi! I'm Bujji, your AI assistant. I'm having a small technical issue right now, but I'm here to help! Could you try asking your question again? 🤖✨",
              seenBy: [{ user: senderId, seenAt: new Date() }],
            });
            
            io.to(conversationId).emit("receive-message", helpfulMessage);
          }

          // Update conversation with latest message
          conversation.latestmessage = text || "[Image]";
          conversation.updatedAt = new Date();
          await conversation.save();

          io.to(conversationId).emit("stop-typing", {
            typer: member._id.toString(),
          });

          break; // Exit after processing first bot
        }
      }

      if (isSentToBot) {
        return; // Exit if message was sent to bot
      }

      // Processing for personal chat between real users (unchanged)
      const receiverId = conversation.members.find(
        (member) => member._id.toString() !== senderId.toString()
      )?._id;

      if (!receiverId) {
        console.error("Receiver not found in conversation");
        return;
      }

      const receiverPersonalRoom = io.sockets.adapter.rooms.get(
        receiverId.toString()
      );

      let isReceiverInsideChatRoom = false;
      if (receiverPersonalRoom) {
        const receiverSid = Array.from(receiverPersonalRoom)[0];
        const chatRoom = io.sockets.adapter.rooms.get(conversationId);
        isReceiverInsideChatRoom = chatRoom ? chatRoom.has(receiverSid) : false;
      }

      console.log("Receiver inside chat room:", isReceiverInsideChatRoom);

      // Create and save the message
      const message = await sendMessageHandler({
        text,
        imageUrl,
        senderId,
        conversationId,
        receiverId,
        isReceiverInsideChatRoom,
      });

      if (message) {
        console.log("Message created successfully:", message._id);
        // CRITICAL FIX: Emit to ALL users in the conversation
        io.to(conversationId).emit("receive-message", message);

        // Send notification to receiver if they're not in chat room
        if (!isReceiverInsideChatRoom) {
          console.log(
            "Emitting new message notification to:",
            receiverId.toString()
          );
          io.to(receiverId.toString()).emit(
            "new-message-notification",
            message
          );
        }
      } else {
        console.error("Failed to create message");
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      console.error("Error stack:", error.stack);
    }
  };

  // Send message
  socket.on("send-message", handleSendMessage);

  // Handle delete message
  const handleDeleteMessage = async (data) => {
    const { messageId, deleteFrom, conversationId } = data;
    const deleted = await deleteMessageHandler({ messageId, deleteFrom });
    if (deleted && deleteFrom.length > 1) {
      io.to(conversationId).emit("message-deleted", data);
    }
  };

  // Delete message
  socket.on("delete-message", handleDeleteMessage);

  // Typing indicator
  socket.on("typing", (data) => {
    socket.to(data.conversationId).emit("typing", data);
  });

  // Stop typing indicator
  socket.on("stop-typing", (data) => {
    socket.to(data.conversationId).emit("stop-typing", data);
  });

  // Disconnect
  socket.on("disconnect", async () => {
    console.log("A user disconnected", currentUserId, socket.id);
    try {
      if (currentUserId) {
        await User.findByIdAndUpdate(currentUserId, {
          isOnline: false,
          lastSeen: new Date(),
        });
      }
    } catch (error) {
      console.error("Error updating user status on disconnect:", error);
    }

    if (currentUserId) {
      const conversations = await Conversation.find({
        members: { $in: [currentUserId] },
      });

      conversations.forEach((conversation) => {
        const sock = io.sockets.adapter.rooms.get(conversation.id);
        if (sock) {
          console.log("Other user is offline is sent to: ", currentUserId);
          io.to(conversation.id).emit("receiver-offline", {});
        }
      });
    }
  });
};
