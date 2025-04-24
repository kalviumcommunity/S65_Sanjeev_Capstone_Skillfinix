import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Button,
  IconButton,
  Avatar,
  Heading,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, ArrowBackIcon, Search2Icon } from "@chakra-ui/icons";
import chatContext from "../../context/chatContext";

const NewChats = ({ setactiveTab }) => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const context = useContext(chatContext);
  const {
    hostName,
    socket,
    user,
    myChatList,
    setMyChatList,
    setReceiver,
    setActiveChatId,
    setMessageList,
  } = context;
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subtitleColor = useColorModeValue("gray.500", "gray.400");

  useEffect(() => {
    const fetchNonFriendsList = async () => {
      try {
        const response = await fetch(`${hostName}/user/non-friends`, {
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
        setUsers(jsonData);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error fetching users",
          description: "Could not load available contacts",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchNonFriendsList();
  }, [hostName, toast]);

  const handleNewChat = async (e, receiverid) => {
    e.preventDefault();
    const payload = { members: [user._id, receiverid] };
    try {
      const response = await fetch(`${hostName}/conversation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const data = await response.json();

      // Set the new chat at the beginning of the list
      setMyChatList([data, ...myChatList]);

      // Clear any existing messages
      setMessageList([]);

      // Set the new receiver
      setReceiver(data.members[0]);

      // Set the active chat ID
      setActiveChatId(data._id);

      // Join the chat room using socket
      socket.emit("join-chat", {
        roomId: data._id,
        userId: user._id,
      });

      // Remove the user from the available users list
      setUsers((users) => users.filter((user) => user._id !== receiverid));

      // Go back to the chat list view
      setactiveTab(0);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error creating chat",
        description: "Could not start a new conversation",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredUsers = users.filter(
    (currentUser) =>
      currentUser._id !== user._id &&
      (searchText === "" ||
        currentUser.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (currentUser.email &&
          currentUser.email.toLowerCase().includes(searchText.toLowerCase())) ||
        (currentUser.phoneNum && currentUser.phoneNum.includes(searchText)))
  );

  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      borderRightWidth="1px"
      borderColor={borderColor}
    >
      {/* Header with Back Button and Search */}
      <Box
        bg={bgColor}
        p={3}
        borderBottomWidth="1px"
        borderColor={borderColor}
        position="sticky"
        top="0"
        zIndex="1"
      >
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={() => setactiveTab(0)}
              variant="ghost"
              borderRadius="full"
              mr={2}
              aria-label="Back"
            />
            <Heading size="md">New Chat</Heading>
          </Flex>
        </Flex>
      </Box>
      {/* Search Box */}
      <Box p={3} pt={2} pb={1}>
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <Search2Icon color="gray.500" boxSize={4} />
          </InputLeftElement>
          <Input
            placeholder="Search contacts"
            borderRadius="lg"
            bg={bgColor}
            border="none"
            _focus={{
              boxShadow: "md",
              bg: "white",
            }}
            _placeholder={{
              color: "gray.500",
              fontSize: "sm",
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            pl={10}
            fontSize="sm"
          />
        </InputGroup>
      </Box>
      {/* New Group Button */}
      <Box p={3} pb={2} pt={0}>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          variant="outline"
          size="sm"
          borderRadius="full"
          width="100%"
        >
          New Group
        </Button>
      </Box>
      <Divider />
      {/* User List */}
      <Box
        flex={1}
        overflowY="auto"
        sx={{
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
        }}
      >
        {filteredUsers.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text color="gray.500">No contacts available</Text>
            {searchText && (
              <Text fontSize="sm" color="gray.400">
                Try a different search term
              </Text>
            )}
          </Box>
        ) : (
          filteredUsers.map((currentUser) => (
            <Box
              key={currentUser._id}
              p={2}
              _hover={{ bg: hoverBgColor }}
              cursor="pointer"
              onClick={(e) => handleNewChat(e, currentUser._id)}
            >
              <Flex align="center">
                <Avatar
                  src={currentUser.profilePic}
                  name={currentUser.name}
                  size="md"
                />
                <Box ml={3} flex={1}>
                  <Text fontWeight="medium">{currentUser.name}</Text>
                  <Text fontSize="sm" color={subtitleColor}>
                    {currentUser.phoneNum || currentUser.email}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default NewChats;
