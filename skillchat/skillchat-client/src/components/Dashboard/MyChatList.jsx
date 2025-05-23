import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  InputGroup,
  InputLeftElement,
  Circle,
  Stack,
  Spinner,
  Avatar,
  useColorModeValue,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { CheckIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import chatContext from "../../context/chatContext";
import wavFile from "../../assets/newmessage.wav";

const scrollbarconfig = {
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "gray.300",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "gray.400",
  },
  "&::-webkit-scrollbar-track": {
    display: "none",
  },
};

const MyChatList = ({ searchQuery }) => {
  var sound = new Audio(wavFile);
  const toast = useToast();
  const context = useContext(chatContext);
  const {
    hostName,
    user,
    socket,
    myChatList: chatlist,
    activeChatId,
    setActiveChatId,
    setMyChatList,
    setIsChatLoading,
    setMessageList,
    setIsOtherUserTyping,
    setReceiver,
    isLoading,
    isOtherUserTyping,
  } = context;

  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const activeBgColor = useColorModeValue("blue.50", "gray.700");
  const activeTextColor = useColorModeValue("blue.800", "blue.100");
  const unreadBgColor = useColorModeValue("blue.500", "blue.200");
  const unreadTextColor = useColorModeValue("white", "gray.800");
  const subtitleColor = useColorModeValue("gray.500", "gray.400");

  useEffect(() => {
    socket.on("new-message-notification", async (data) => {
      var newlist = chatlist;

      let chatIndex = newlist.findIndex(
        (chat) => chat._id === data.conversationId
      );
      if (chatIndex === -1) {
        newlist.unshift(data.conversation);
      }
      chatIndex = newlist.findIndex((chat) => chat._id === data.conversationId);
      newlist[chatIndex].latestmessage = data.text;

      if (activeChatId !== data.conversationId) {
        newlist[chatIndex].unreadCounts = newlist[chatIndex].unreadCounts.map(
          (unread) => {
            if (unread.userId === user._id) {
              unread.count = unread.count + 1;
            }
            return unread;
          }
        );
        newlist[chatIndex].updatedAt = new Date();
      }

      let updatedChat = newlist.splice(chatIndex, 1)[0];
      newlist.unshift(updatedChat);

      setMyChatList([...newlist]);

      let sender = newlist.find((chat) => chat._id === data.conversationId)
        .members[0];

      activeChatId !== data.conversationId &&
        sound.play().catch((error) => {
          console.log(error);
        });
    });

    return () => {
      socket.off("new-message-notification");
    };
  }, [chatlist, activeChatId]);

  const filteredChats = chatlist.filter((chat) => {
    if (!searchQuery) return true;
    return chat.members[0].name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleChatOpen = async (chatid, receiver) => {
    try {
      setIsChatLoading(true);
      setMessageList([]);
      setIsOtherUserTyping(false);
      const msg = document.getElementById("new-message");
      if (msg) {
        document.getElementById("new-message").value = "";
        document.getElementById("new-message").focus();
      }

      setIsOtherUserTyping(false);
      await socket.emit("stop-typing", {
        typer: user._id,
        conversationId: activeChatId,
      });
      await socket.emit("leave-chat", activeChatId);

      socket.emit("join-chat", { roomId: chatid, userId: user._id });
      setActiveChatId(chatid);

      const response = await fetch(`${hostName}/message/${chatid}/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();

      setMessageList(jsonData);
      
      // Get conversation details for group or individual chat
      const chatResponse = await fetch(`${hostName}/conversation/${chatid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      
      if (chatResponse.ok) {
        const chatData = await chatResponse.json();
        if (chatData.isGroup) {
          setReceiver({
            _id: chatData._id,
            name: chatData.groupName,
            isGroup: true,
            members: chatData.members.filter(m => m._id !== user._id)
          });
        } else {
          // Make sure receiver exists before setting it
          if (receiver) {
            setReceiver(receiver);
          } else {
            // If receiver is null but chat is not a group, set from chat data
            const otherMember = chatData.members.find(m => m._id !== user._id);
            if (otherMember) {
              setReceiver(otherMember);
            }
          }
        }
      } else {
        // Only set receiver if it's not null
        if (receiver) {
          setReceiver(receiver);
        }
      }
      
      setIsChatLoading(false);

      const newlist = chatlist.map((chat) => {
        if (chat._id === chatid) {
          chat.unreadCounts = chat.unreadCounts.map((unread) => {
            if (unread.userId === user._id) {
              unread.count = 0;
            }
            return unread;
          });
        }
        return chat;
      });

      setMyChatList(newlist);

      setTimeout(() => {
        document.getElementById("chat-box")?.scrollTo({
          top: document.getElementById("chat-box").scrollHeight,
        });
      }, 100);
    } catch (error) {
      console.log(error);
      setIsChatLoading(false);
    }
  };

  const formatPreviewMessage = (message) => {
    if (!message) return "No messages yet";
    return message.length > 30 ? `${message.substring(0, 30)}...` : message;
  };

  return !isLoading ? (
    <Box w="100%" h="100%" overflowY="auto" sx={scrollbarconfig}>
      <Box>
        {filteredChats.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500">
              No chats found
            </Text>
          </Box>
        ) : (
          filteredChats.map((chat) => {
            const isActiveChat = activeChatId === chat._id;
            const unreadCountObj = chat.unreadCounts.find(
              (unread) => unread.userId === user._id
            );
            const unreadCount = unreadCountObj ? unreadCountObj.count : 0;
            const hasUnread = unreadCount > 0;

            return (
              <Box
                key={chat._id}
                onClick={() => handleChatOpen(chat._id, chat.isGroup ? null : chat.members[0])}
                py={3}
                px={3}
                cursor="pointer"
                bg={isActiveChat ? activeBgColor : "transparent"}
                _hover={{ bg: isActiveChat ? activeBgColor : hoverBgColor }}
                transition="all 0.2s"
                position="relative"
                borderBottomWidth="1px"
                borderColor="gray.100"
                _dark={{ borderColor: "gray.700" }}
              >
                <Flex align="center">
                  <Avatar 
                    src={chat.isGroup 
                      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.groupName)}&background=random&bold=true` 
                      : chat.members[0]?.profilePic
                    } 
                    name={chat.isGroup ? chat.groupName : chat.members[0]?.name} 
                    size="md" 
                    mr={3} 
                  />
                  <Box flex={1} pr={1}>
                    <Flex justify="space-between" align="center">
                      <Text
                        fontWeight={hasUnread ? "bold" : "medium"}
                        color={isActiveChat ? activeTextColor : undefined}
                        fontSize="md"
                      >
                        {chat.isGroup ? chat.groupName : chat.members[0]?.name}
                        {chat.isGroup && (
                          <Text as="span" fontSize="xs" ml={1} color={subtitleColor}>
                            • {chat.members?.length || 0} members
                          </Text>
                        )}
                      </Text>
                      <Text fontSize="xs" color={subtitleColor}>
                        {new Date(chat.updatedAt).toDateString() === new Date().toDateString()
                          ? new Date(chat.updatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : new Date(chat.updatedAt).toDateString() ===
                            new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()
                          ? "Yesterday"
                          : new Date(chat.updatedAt).toLocaleDateString()}
                      </Text>
                    </Flex>
                    <Flex align="center" justify="space-between" mt={1}>
                      <Tooltip label={chat.latestmessage || "No messages yet"} placement="top" hasArrow openDelay={500}>
                        <Text
                          fontSize="sm"
                          color={isOtherUserTyping && isActiveChat ? "blue.500" : subtitleColor}
                          noOfLines={1}
                          width="calc(100% - 25px)"
                          isTruncated
                          display="flex"
                          alignItems="center"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {chat.latestmessage && chat.latestmessage.senderId === user._id && (
                            <Icon
                              as={CheckIcon}
                              boxSize={3}
                              mr={1}
                              flexShrink={0}
                              color={hasUnread ? "gray.400" : "blue.500"}
                            />
                          )}
                          {isOtherUserTyping && isActiveChat
                            ? "typing..."
                            : formatPreviewMessage(chat.latestmessage)}
                        </Text>
                      </Tooltip>
                      {hasUnread && (
                        <Circle
                          size="20px"
                          bg={unreadBgColor}
                          color={unreadTextColor}
                          fontSize="xs"
                          fontWeight="bold"
                          flexShrink={0}
                          ml={1}
                        >
                          {unreadCount}
                        </Circle>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            );
          })          
        )}
      </Box>
    </Box>
  ) : (
    <Box margin="auto" w="max-content" mt="30vh">
      <Spinner size="xl" color="blue.500" />
    </Box>
  );
};

export default MyChatList;