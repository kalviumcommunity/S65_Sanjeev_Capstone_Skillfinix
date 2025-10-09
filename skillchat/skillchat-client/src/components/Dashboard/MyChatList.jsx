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

const MyChatList = ({ searchQuery, activeTab }) => {
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

  // Fixed dark mode colors - only change dark mode (second value)
  const bgColor = useColorModeValue("white", "#0b141a");
  const hoverBgColor = useColorModeValue("gray.100", "#202c33");
  const activeBgColor = useColorModeValue("blue.50", "#2a3942");
  const activeTextColor = useColorModeValue("blue.800", "#e9edef");
  const unreadBgColor = useColorModeValue("blue.500", "#00a884");
  const unreadTextColor = useColorModeValue("white", "#111b21");
  const subtitleColor = useColorModeValue("gray.500", "#8696a0");
  const borderColor = useColorModeValue("gray.100", "#313d45");

  // Simple notification sound function
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Notification sound could not be played:", error);
    }
  };

  useEffect(() => {
    socket.on("new-message-notification", async (data) => {
      var newlist = [...chatlist];
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

        let updatedChat = newlist.splice(chatIndex, 1)[0];
        newlist.unshift(updatedChat);
        setMyChatList([...newlist]);

        if (activeChatId !== data.conversationId) {
          playNotificationSound();
        }
      }
    });

    return () => {
      socket.off("new-message-notification");
    };
  }, [chatlist, activeChatId, socket, user._id, setMyChatList]);

  const filteredChats = chatlist.filter((chat) => {
    if (!searchQuery) {
      switch (activeTab) {
        case "unread":
          const unreadCountObj = chat.unreadCounts.find(
            (unread) => unread.userId === user._id
          );
          return unreadCountObj && unreadCountObj.count > 0;
        case "favorites":
          return chat.isFavorite;
        case "groups":
          return chat.isGroup;
        default:
          return true;
      }
    }

    const searchTerm = searchQuery.toLowerCase();
    if (chat.isGroup) {
      return chat.groupName?.toLowerCase().includes(searchTerm);
    } else {
      return chat.members[0]?.name?.toLowerCase().includes(searchTerm);
    }
  });

  const handleChatOpen = async (chatid, receiver) => {
    try {
      setIsChatLoading(true);
      setMessageList([]);
      setIsOtherUserTyping(false);

      const msg = document.getElementById("new-message");
      if (msg) {
        msg.value = "";
        msg.focus();
      }

      await socket.emit("stop-typing", {
        typer: user._id,
        conversationId: activeChatId,
      });
      await socket.emit("leave-chat", activeChatId);
      socket.emit("join-chat", { roomId: chatid, userId: user._id });
      setActiveChatId(chatid);

      const response = await fetch(
        `${hostName}/message/${chatid}/${user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const jsonData = await response.json();
      setMessageList(jsonData);

      if (receiver) {
        setReceiver(receiver);
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
        const chatBox = document.getElementById("chat-box");
        if (chatBox) {
          chatBox.scrollTo({
            top: chatBox.scrollHeight,
          });
        }
      }, 100);
    } catch (error) {
      console.log(error);
      setIsChatLoading(false);
      toast({
        title: "Error loading chat",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatPreviewMessage = (message) => {
    if (!message) return "No messages yet";
    return message.length > 30 ? `${message.substring(0, 30)}...` : message;
  };

  return !isLoading ? (
    <Box h="100%" overflowY="auto" css={scrollbarconfig} bg={bgColor}>
      {filteredChats.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="200px"
          color={subtitleColor}
        >
          <Text>No chats found</Text>
          {searchQuery && (
            <Text fontSize="sm" mt={2}>
              Try adjusting your search terms
            </Text>
          )}
        </Flex>
      ) : (
        filteredChats.map((chat) => {
          const isActiveChat = activeChatId === chat._id;
          const unreadCountObj = chat.unreadCounts.find(
            (unread) => unread.userId === user._id
          );
          const unreadCount = unreadCountObj ? unreadCountObj.count : 0;
          const hasUnread = unreadCount > 0;

          // Fully fixed: profile and group pics visible
          const chatUser = chat.isGroup ? null : chat.members[0];
          const displayName = chat.isGroup ? chat.groupName : chatUser?.name;
          const profilePic = chat.isGroup ? chat.groupPic : chatUser?.profilePic;

          return (
            <Flex
              key={chat._id}
              onClick={() =>
                handleChatOpen(chat._id, chat.isGroup ? null : chatUser)
              }
              py={3}
              px={3}
              cursor="pointer"
              bg={isActiveChat ? activeBgColor : "transparent"}
              _hover={{ bg: isActiveChat ? activeBgColor : hoverBgColor }}
              transition="all 0.2s"
              borderBottomWidth="1px"
              borderColor={borderColor}
              align="center"
            >
              {/* profile/group Avatar - only this is changed! */}
              <Avatar
                size="md"
                name={displayName}
                src={profilePic}
                mr={3}
              />

              <Box flex={1} minWidth={0}>
                <Flex justify="space-between" align="center" mb={1}>
                  <Text
                    fontWeight={hasUnread ? "bold" : "normal"}
                    color={isActiveChat ? activeTextColor : "inherit"}
                    fontSize="sm"
                    noOfLines={1}
                  >
                    {displayName}
                  </Text>
                  <Text fontSize="xs" color={subtitleColor}>
                    {new Date(chat.updatedAt).toDateString() ===
                    new Date().toDateString()
                      ? new Date(chat.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Yesterday"}
                  </Text>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Text
                    fontSize="sm"
                    color={subtitleColor}
                    noOfLines={1}
                    fontWeight={hasUnread ? "medium" : "normal"}
                  >
                    {isOtherUserTyping && isActiveChat
                      ? "typing..."
                      : formatPreviewMessage(chat.latestmessage)}
                  </Text>
                  {hasUnread && (
                    <Circle
                      size={5}
                      bg={unreadBgColor}
                      color={unreadTextColor}
                      ml={2}
                    >
                      <Text fontSize="xs" fontWeight="bold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Text>
                    </Circle>
                  )}
                </Flex>
              </Box>
            </Flex>
          );
        })
      )}
    </Box>
  ) : (
    <Stack spacing={4} p={4} bg={bgColor}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Flex key={i} align="center">
          <Avatar size="md" mr={3} />
          <Box flex={1}>
            <Text fontWeight="bold" color="gray.300">
              Loading...
            </Text>
            <Text fontSize="sm" color="gray.400">
              Please wait
            </Text>
          </Box>
        </Flex>
      ))}
    </Stack>
  );
};

export default MyChatList;
