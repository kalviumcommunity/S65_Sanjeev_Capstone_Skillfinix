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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  AvatarGroup,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import {
  AddIcon,
  ArrowBackIcon,
  Search2Icon,
  CheckIcon,
} from "@chakra-ui/icons";
import chatContext from "../../context/chatContext";

const NewChats = ({ setactiveTab }) => {
  const [users, setUsers] = useState([]);
  const [existingContacts, setExistingContacts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupCreationMode, setGroupCreationMode] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

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

    // Extract existing contacts from myChatList
    if (myChatList && myChatList.length > 0) {
      const contacts = myChatList
        .filter((chat) => !chat.isGroup) // Filter out groups
        .map((chat) => chat.members[0]); // Get the other member
      setExistingContacts(contacts);
    }
  }, [hostName, toast, myChatList]);

  const handleNewChat = async (e, receiverid) => {
    if (groupCreationMode) {
      // Toggle user selection for group
      e.preventDefault();
      if (selectedUsers.includes(receiverid)) {
        setSelectedUsers(selectedUsers.filter((id) => id !== receiverid));
      } else {
        setSelectedUsers([...selectedUsers, receiverid]);
      }
      return;
    }

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

  const handleCreateGroup = async () => {
    if (selectedUsers.length < 2) {
      toast({
        title: "Not enough members",
        description: "Please select at least 2 users for a group",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!groupName.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a name for your group",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Add the current user to the group members
      const allMembers = [user._id, ...selectedUsers];

      const payload = {
        members: allMembers,
        isGroup: true,
        groupName: groupName,
      };

      const response = await fetch(`${hostName}/conversation/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create group: ${errorText}`);
      }

      const data = await response.json();

      // Make sure group data is structured properly
      if (!data._id) {
        throw new Error("Created group is missing ID");
      }

      // Create properly structured group receiver object
      const groupReceiver = {
        _id: data._id,
        name: data.groupName,
        isGroup: true,
        members: data.members?.filter((m) => m._id !== user._id) || []
      };

      // Add the new group to the chat list
      setMyChatList([data, ...myChatList]);

      // Clear messages
      setMessageList([]);

      // Set receiver to the group chat object
      setReceiver(groupReceiver);

      // Set active chat to the new group
      setActiveChatId(data._id);

      // Join the group chat room
      socket.emit("join-chat", {
        roomId: data._id,
        userId: user._id,
      });

      // Reset states
      setSelectedUsers([]);
      setGroupName("");
      setIsGroupModalOpen(false);
      setGroupCreationMode(false);

      // Go back to chat list
      setactiveTab(0);

      toast({
        title: "Group created",
        description: `${groupName} has been created successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Group creation error:", error);
      toast({
        title: "Error creating group",
        description: error.message || "Could not create the group chat",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openGroupCreation = () => {
    setGroupCreationMode(true);
  };

  const cancelGroupCreation = () => {
    setGroupCreationMode(false);
    setSelectedUsers([]);
    setIsGroupModalOpen(false);
  };

  const completeGroupSelection = () => {
    if (selectedUsers.length < 2) {
      toast({
        title: "Not enough members",
        description: "Please select at least 2 users for a group",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsGroupModalOpen(true);
  };

  const filteredUsers = users.filter(
    (currentUser) =>
      currentUser._id !== user._id &&
      (searchText === "" ||
        currentUser.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (currentUser.phoneNum && currentUser.phoneNum.includes(searchText)))
  );

  const filteredExistingContacts = existingContacts.filter(
    (contact) =>
      searchText === "" ||
      contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (contact.phoneNum && contact.phoneNum.includes(searchText))
  );

  // Function to get display subtitle (only phone number, no email)
  const getContactSubtitle = (user) => {
    return user.phoneNum || ""; // Only show phone number or nothing
  };

  // Function to get selected user details
  const getSelectedUserDetails = (userId) => {
    // Check in new users first
    const newUser = users.find((user) => user._id === userId);
    if (newUser) return newUser;

    // Then check in existing contacts
    return existingContacts.find((contact) => contact._id === userId);
  };

  return (
    <Box
      h="100%"
      display="flex"
      flexDirection="column"
      borderRightWidth="1px"
      borderColor={borderColor}
    >
      {/* Header with Back Button and Title */}
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
              onClick={() =>
                groupCreationMode ? cancelGroupCreation() : setactiveTab(0)
              }
              variant="ghost"
              borderRadius="full"
              mr={2}
              aria-label="Back"
            />
            <Heading size="md">
              {groupCreationMode
                ? `New Group (${selectedUsers.length})`
                : "New Chat"}
            </Heading>
          </Flex>
          {groupCreationMode && selectedUsers.length > 0 && (
            <IconButton
              icon={<CheckIcon />}
              colorScheme="blue"
              borderRadius="full"
              onClick={completeGroupSelection}
              aria-label="Create Group"
            />
          )}
        </Flex>
      </Box>

      {/* Selected Members Preview (only shown in group creation mode) */}
      {groupCreationMode && selectedUsers.length > 0 && (
        <Box p={3} pt={2} pb={2}>
          <AvatarGroup size="sm" max={5} spacing="-0.5rem">
            {selectedUsers.map((userId) => {
              const selectedUser = getSelectedUserDetails(userId);
              return selectedUser ? (
                <Avatar
                  key={userId}
                  name={selectedUser.name}
                  src={selectedUser.profilePic}
                />
              ) : null;
            })}
          </AvatarGroup>
        </Box>
      )}

      {/* Search Box */}
      <Box p={3} pt={2} pb={1}>
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <Search2Icon color="gray.500" boxSize={4} />
          </InputLeftElement>
          <Input
            placeholder={
              groupCreationMode ? "Search contacts" : "Search contacts"
            }
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

      {/* New Group Button (only shown in regular mode) */}
      {!groupCreationMode && (
        <Box p={3} pb={2} pt={0}>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            variant="outline"
            size="sm"
            borderRadius="full"
            width="100%"
            onClick={openGroupCreation}
          >
            New Group
          </Button>
        </Box>
      )}

      <Divider />

      {/* User Lists with Tabs - Only show tabs in Group Creation mode */}
      {groupCreationMode ? (
        <Box flex={1} display="flex" flexDirection="column">
          <Tabs
            isFitted
            variant="enclosed"
            index={tabIndex}
            onChange={setTabIndex}
            colorScheme="blue"
          >
            <TabList>
              <Tab>New Contacts</Tab>
              <Tab>Your Chats</Tab>
            </TabList>
            <TabPanels flex={1}>
              <TabPanel p={0} flex={1}>
                <UserList
                  users={filteredUsers}
                  selectedUsers={selectedUsers}
                  groupCreationMode={groupCreationMode}
                  handleNewChat={handleNewChat}
                  getContactSubtitle={getContactSubtitle}
                  hoverBgColor={hoverBgColor}
                  subtitleColor={subtitleColor}
                />
              </TabPanel>
              <TabPanel p={0} flex={1}>
                <UserList
                  users={filteredExistingContacts}
                  selectedUsers={selectedUsers}
                  groupCreationMode={groupCreationMode}
                  handleNewChat={handleNewChat}
                  getContactSubtitle={getContactSubtitle}
                  hoverBgColor={hoverBgColor}
                  subtitleColor={subtitleColor}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      ) : (
        <Box flex={1}>
          <UserList
            users={filteredUsers}
            selectedUsers={selectedUsers}
            groupCreationMode={groupCreationMode}
            handleNewChat={handleNewChat}
            getContactSubtitle={getContactSubtitle}
            hoverBgColor={hoverBgColor}
            subtitleColor={subtitleColor}
          />
        </Box>
      )}

      {/* Group Name Modal */}
      <Modal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Group Name</FormLabel>
              <Input
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>

            <Box mt={4}>
              <Text fontWeight="medium" mb={2}>
                Selected Members ({selectedUsers.length})
              </Text>
              <Stack spacing={2} maxH="200px" overflowY="auto">
                {selectedUsers.map((userId) => {
                  const selectedUser = getSelectedUserDetails(userId);
                  return selectedUser ? (
                    <Flex key={userId} align="center">
                      <Avatar
                        src={selectedUser.profilePic}
                        name={selectedUser.name}
                        size="sm"
                      />
                      <Text ml={2}>{selectedUser.name}</Text>
                    </Flex>
                  ) : null;
                })}
              </Stack>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateGroup}>
              Create Group
            </Button>
            <Button onClick={() => setIsGroupModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Extracted User List component to avoid code duplication
const UserList = ({
  users,
  selectedUsers,
  groupCreationMode,
  handleNewChat,
  getContactSubtitle,
  hoverBgColor,
  subtitleColor,
}) => {
  return (
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
      {users.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500">No contacts available</Text>
        </Box>
      ) : (
        users.map((currentUser) => (
          <Box
            key={currentUser._id}
            p={2}
            _hover={{ bg: hoverBgColor }}
            cursor="pointer"
            onClick={(e) => handleNewChat(e, currentUser._id)}
            bg={
              selectedUsers.includes(currentUser._id)
                ? hoverBgColor
                : "transparent"
            }
          >
            <Flex align="center">
              <Avatar
                src={currentUser.profilePic}
                name={currentUser.name}
                size="md"
              />
              <Box ml={3} flex={1}>
                <Text fontWeight="medium">{currentUser.name}</Text>
                {getContactSubtitle(currentUser) && (
                  <Text fontSize="sm" color={subtitleColor}>
                    {getContactSubtitle(currentUser)}
                  </Text>
                )}
              </Box>
              {groupCreationMode && selectedUsers.includes(currentUser._id) && (
                <IconButton
                  icon={<CheckIcon />}
                  colorScheme="blue"
                  variant="solid"
                  size="sm"
                  isRound
                  aria-label="Selected"
                />
              )}
            </Flex>
          </Box>
        ))
      )}
    </Box>
  );
};

export default NewChats;
