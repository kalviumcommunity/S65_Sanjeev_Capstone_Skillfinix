import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Text,
  useToast,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import Lottie from "react-lottie";
import animationdata from "../../typingAnimation.json";
import chatContext from "../../context/chatContext";
import ChatAreaTop from "./ChatAreaTop";
import FileUploadModal from "../miscellaneous/FileUploadModal";
import ChatLoadingSpinner from "../miscellaneous/ChatLoadingSpinner";
import axios from "axios";
import SingleMessage from "./SingleMessage";
import { ChatInput } from "./ChatInput"; // Import the WhatsApp-style input
import { marked } from "marked";

const scrollbarconfig = {
  "&::-webkit-scrollbar": {
    width: "5px",
    height: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "gray.300",
    borderRadius: "5px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "gray.400",
  },
  "&::-webkit-scrollbar-track": {
    display: "none",
  },
};

const markdownToHtml = (markdownText) => {
  const html = marked(markdownText);
  return { __html: html };
};

// Helper function to truncate messages
const truncateMessage = (message, maxLength = 40) => {
  if (!message) return "";
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + "...";
};

const ChatArea = () => {
  const context = useContext(chatContext);
  const {
    hostName,
    user,
    receiver,
    socket,
    activeChatId,
    messageList,
    setMessageList,
    isOtherUserTyping,
    setIsOtherUserTyping,
    setActiveChatId,
    setReceiver,
    setMyChatList,
    myChatList,
    isChatLoading,
  } = context;
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const containerBgColor = useColorModeValue("white", "#0b141a");

  // Lottie Options for typing animation
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationdata,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const handlePopState = () => {
      socket.emit("leave-chat", activeChatId);
      setActiveChatId("");
      setMessageList([]);
      setReceiver({});
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [socket, activeChatId, setActiveChatId, setMessageList, setReceiver]);

  // Socket event listeners
  useEffect(() => {
    socket.on("user-joined-room", (userId) => {
      const updatedList = messageList.map((message) => {
        if (message.senderId === user._id && userId !== user._id) {
          const index = message.seenBy.findIndex(
            (seen) => seen.user === userId
          );
          if (index === -1) {
            message.seenBy.push({ user: userId, seenAt: new Date() });
          }
        }
        return message;
      });
      setMessageList(updatedList);
    });

    socket.on("typing", (data) => {
      if (data.typer !== user._id) {
        setIsOtherUserTyping(true);
      }
    });

    socket.on("stop-typing", (data) => {
      if (data.typer !== user._id) {
        setIsOtherUserTyping(false);
      }
    });

    // In the socket event listeners useEffect
    socket.on("receive-message", (data) => {
      // Handle AI responses separately if needed
      if (data.isAiResponse) {
        setMessageList((prev) => [...prev, data.aiResponse]);
      } else {
        setMessageList((prev) => [...prev, data]);
      }

      setTimeout(() => {
        document.getElementById("chat-box")?.scrollTo({
          top: document.getElementById("chat-box").scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    });

    socket.on("message-deleted", (data) => {
      const { messageId } = data;
      setMessageList((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    return () => {
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("receive-message");
      socket.off("message-deleted");
    };
  }, [socket, messageList, setMessageList, user._id, setIsOtherUserTyping]);

  const getPreSignedUrl = async (fileName, fileType) => {
    if (!fileName || !fileType) return;
    try {
      const response = await fetch(
        `${hostName}/user/presigned-url?filename=${fileName}&filetype=${fileType}`,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get pre-signed URL");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

const handleSendMessage = async (e, messageText, file) => {
  e.preventDefault();
  const awsHost = "https://conversa-chat.s3.ap-south-1.amazonaws.com/";
  
  socket.emit("stop-typing", {
    typer: user._id,
    conversationId: activeChatId,
  });

  if (messageText === "" && !file) {
    toast({
      title: "Message cannot be empty",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  let key;
  if (file) {
    try {
      const { url, fields } = await getPreSignedUrl(file.name, file.type);
      const formData = new FormData();
      Object.entries({ ...fields, file }).forEach(([k, v]) => {
        formData.append(k, v);
      });
      
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 201) {
        throw new Error("Failed to upload file");
      }
      key = fields.key;
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  }

  const data = {
    text: messageText,
    conversationId: activeChatId,
    senderId: user._id,
    imageUrl: file ? `${awsHost}${key}` : null,
  };

  // CRITICAL FIX: Use socket instead of HTTP
  socket.emit("send-message", data);
  
  // Update chat list locally for immediate UI feedback
  const truncatedMessage = messageText
    ? truncateMessage(messageText)
    : file
    ? "[File]"
    : "";
    
  const updatedChatList = myChatList
    .map((chat) => {
      if (chat._id === activeChatId) {
        return {
          ...chat,
          latestmessage: truncatedMessage,
          updatedAt: new Date().toUTCString(),
        };
      }
      return chat;
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
  setMyChatList(updatedChatList);

  setTimeout(() => {
    document.getElementById("chat-box")?.scrollTo({
      top: document.getElementById("chat-box").scrollHeight,
      behavior: "smooth",
    });
  }, 100);
};


  const removeMessageFromList = (messageId) => {
    setMessageList((prev) => prev.filter((msg) => msg._id !== messageId));
  };

  return (
    <>
      {activeChatId !== "" ? (
        <>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            h="100%"
            w="100%"
            maxW="100%"
            position="relative"
            bg={containerBgColor}
          >
            <ChatAreaTop />

            {isChatLoading && <ChatLoadingSpinner />}

            <Box
              id="chat-box"
              h="calc(100% - 120px)"
              overflowY="auto"
              sx={scrollbarconfig}
              mx={1}
              bg={containerBgColor}
              pb="80px" // Add padding to account for fixed input area
            >
              {messageList?.map((message, index) =>
                !message.deletedby?.includes(user._id) ? (
                  <SingleMessage
                    key={`${message._id}-${index}`}
                    message={message}
                    user={user}
                    receiver={receiver}
                    markdownToHtml={markdownToHtml}
                    scrollbarconfig={scrollbarconfig}
                    socket={socket}
                    activeChatId={activeChatId}
                    removeMessageFromList={removeMessageFromList}
                    toast={toast}
                  />
                ) : null
              )}
            </Box>

            {/* Typing indicator */}
            <Box position="absolute" bottom="60px" left={4} w="fit-content">
              {isOtherUserTyping && (
                <Lottie
                  options={defaultOptions}
                  height={20}
                  width={20}
                  isStopped={false}
                  isPaused={false}
                />
              )}
            </Box>

            {/* WhatsApp-style input with proper layout */}
            <ChatInput
              onSendMessage={handleSendMessage}
              onOpenFileUpload={onOpen}
            />
          </Box>
          <FileUploadModal
            isOpen={isOpen}
            onClose={onClose}
            handleSendMessage={handleSendMessage}
          />
        </>
      ) : (
        !isChatLoading && (
          <Box
            display={{
              base: "none",
              md: "block",
            }}
            mx="auto"
            w="fit-content"
            mt="30vh"
            textAlign="center"
          >
            <Text fontSize="6vw" fontWeight="bold" fontFamily="Work sans">
              SkillChat
            </Text>
            <Text fontSize="2vw">Online SkillSharing Chat app</Text>
            <Text fontSize="md">Select a chat to start messaging</Text>
          </Box>
        )
      )}
    </>
  );
};

export default ChatArea;
