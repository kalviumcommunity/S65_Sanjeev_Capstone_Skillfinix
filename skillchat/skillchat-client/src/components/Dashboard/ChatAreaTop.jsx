import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Tooltip,
  SkeletonCircle,
  Skeleton,
  Circle,
  Stack,
  Avatar,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowBackIcon, InfoIcon } from "@chakra-ui/icons";
import React, { useContext, useEffect, useCallback } from "react";
import chatContext from "../../context/chatContext";
import { ProfileModal } from "../miscellaneous/ProfileModal";
import GroupInfoModal from "../miscellaneous/GroupInfoModal";

const ChatAreaTop = () => {
  const context = useContext(chatContext);
  const {
    receiver,
    setReceiver,
    activeChatId,
    setActiveChatId,
    setMessageList,
    isChatLoading,
    hostName,
    socket,
    myChatList,
  } = context;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isGroupInfoOpen,
    onOpen: onGroupInfoOpen,
    onClose: onGroupInfoClose,
  } = useDisclosure();

  // Get color values like your original
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Get current conversation from chat list
  const currentConversation = myChatList.find(
    (chat) => chat._id === activeChatId
  );

  const isGroup = currentConversation?.isGroup || receiver.isGroup;

  const getReceiverOnlineStatus = useCallback(async () => {
    if (!receiver._id || isGroup) {
      return;
    }

    try {
      const response = await fetch(
        `${hostName}/user/online-status/${receiver._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setReceiver((receiver) => ({
        ...receiver,
        isOnline: data.isOnline,
      }));
    } catch (error) {
      console.error("Error fetching online status:", error);
    }
  }, [receiver._id, isGroup, hostName, setReceiver]);

  const handleBack = () => {
    socket.emit("leave-chat", activeChatId);
    setActiveChatId("");
    setMessageList([]);
    setReceiver({});
  };

  const getLastSeenString = (lastSeen) => {
    var lastSeenString = "last seen ";
    if (new Date(lastSeen).toDateString() === new Date().toDateString()) {
      lastSeenString += "today ";
    } else if (
      new Date(lastSeen).toDateString() ===
      new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()
    ) {
      lastSeenString += "yesterday ";
    } else {
      lastSeenString += `on ${new Date(lastSeen).toLocaleDateString()} `;
    }

    lastSeenString += `at ${new Date(lastSeen).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    return lastSeenString;
  };

  useEffect(() => {
    getReceiverOnlineStatus();
  }, [getReceiverOnlineStatus]);

  return (
    <>
      <Flex
        h="60px"
        w="100%"
        bg={bgColor}
        borderBottomWidth="1px"
        borderColor={borderColor}
        alignItems="center"
        px={4}
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            onClick={() => handleBack()}
            mr={2}
          />

          {isChatLoading ? (
            <>
              <SkeletonCircle size="10" />
              <Skeleton height="20px" width="150px" ml={3} />
            </>
          ) : isGroup ? (
            <>
              <Avatar
                size="md"
                name={currentConversation?.groupName || receiver.name}
                src={currentConversation?.groupIcon}
                cursor="pointer"
                onClick={onGroupInfoOpen}
              />
              <Box ml={3}>
                <Text fontSize="lg" fontWeight="bold">
                  {currentConversation?.groupName || receiver.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {currentConversation?.members?.length || 0} members
                </Text>
              </Box>
            </>
          ) : (
            <>
              <Tooltip label={receiver.name}>
                <Circle
                  size="45px"
                  overflow="hidden"
                  border="2px"
                  borderColor="gray.300"
                  cursor="pointer"
                  onClick={onOpen}
                >
                  <Image
                    src={receiver.profilePic}
                    alt={receiver.name}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </Circle>
              </Tooltip>
              <Stack ml={3} spacing={0}>
                <Text fontSize="lg" fontWeight="bold">
                  {receiver.name}
                </Text>
                {receiver.isOnline ? (
                  <Text fontSize="xs" color="green.500">
                    active now
                  </Text>
                ) : (
                  <Text fontSize="xs" color="gray.500">
                    {getLastSeenString(receiver.lastSeen)}
                  </Text>
                )}
              </Stack>
            </>
          )}
        </Flex>

        {isGroup && (
          <Button
            leftIcon={<InfoIcon />}
            variant="ghost"
            size="sm"
            onClick={onGroupInfoOpen}
          >
            Info
          </Button>
        )}
      </Flex>

      <ProfileModal isOpen={isOpen} onClose={onClose} user={receiver} />

      {isGroup && currentConversation && (
        <GroupInfoModal
          isOpen={isGroupInfoOpen}
          onClose={onGroupInfoClose}
          conversation={currentConversation}
        />
      )}
    </>
  );
};

export default ChatAreaTop;
