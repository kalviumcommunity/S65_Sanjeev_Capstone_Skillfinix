import React, { useContext, useRef, useState } from "react";
import {
  Box,
  Text,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  VStack,
  IconButton,
  Flex,
  Divider,
  FormControl,
  Input,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Button,
  Heading,
  Editable,
  EditableInput,
  EditablePreview,
  CircularProgress,
} from "@chakra-ui/react";
import {
  FaCamera,
  FaPencilAlt,
  FaSignOutAlt,
  FaCheck,
  FaBell,
  FaLock,
  FaQuestionCircle,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import chatContext from "../../context/chatContext";

const ProfileMenu = (props) => {
  const context = useContext(chatContext);
  const {
    user,
    setUser,
    setIsAuthenticated,
    setActiveChatId,
    setMessageList,
    setReceiver,
    setMyChatList,
    socket,
    hostName,
  } = context;
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isUploading, setIsUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [status, setStatus] = useState(
    user?.status || "Chatting, laughing, and knowledge stacking 😄💬📚"
  );

  const handleLogout = (e) => {
    e.preventDefault();
    // First, close the profile menu
    props.onClose();
    // Disconnect socket if connected
    if (socket && socket.connected) {
      socket.disconnect();
    }

    // Clear all user data and tokens
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Set authentication state to false and clear user data
    setIsAuthenticated(false);
    setUser({});
    setMessageList([]);
    setActiveChatId("");
    setReceiver({});
    // Show toast
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
    // Navigate to login page with replace to prevent back navigation
    navigate("/", { replace: true });
  };

  const handleProfilePicChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];

      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target.result;

        try {
          // Update backend
          const response = await fetch(`${hostName}/user/update`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ profilePic: base64Image }),
          });

          const json = await response.json();

          if (response.status !== 200) {
            toast({
              title: "Upload failed",
              description: json.error || "Could not update profile picture",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          } else {
            // Update local state and localStorage only after successful backend update
            const updatedUser = { ...user, profilePic: base64Image };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            if (typeof setMyChatList === "function") {
              setMyChatList((prev) =>
                prev.map((chat) =>
                  !chat.isGroup && chat.members[0]?._id === user._id
                    ? {
                        ...chat,
                        members: [
                          {
                            ...chat.members[0],
                            profilePic: base64Image,
                          },
                        ],
                      }
                    : chat
                )
              );
            }

            toast({
              title: "Profile picture updated",
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "bottom",
            });
          }
        } catch (error) {
          console.error("Error uploading profile picture:", error);
          toast({
            title: "Upload failed",
            description: "An error occurred while uploading",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setIsUploading(false);
        toast({
          title: "File read error",
          description: "Could not read the selected file",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = async (newName) => {
    if (newName.trim() !== "") {
      try {
        // Update backend
        const response = await fetch(`${hostName}/user/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ name: newName }),
        });

        const json = await response.json();

        if (response.status !== 200) {
          toast({
            title: "Update failed",
            description: json.error || "Could not update name",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        } else {
          // Update local state and localStorage only after successful backend update
          const updatedUser = { ...user, name: newName };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));

          toast({
            title: "Name updated",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
        }
      } catch (error) {
        console.error("Error updating name:", error);
        toast({
          title: "Update failed",
          description: "An error occurred while updating name",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const handleStatusChange = async (e) => {
    if (e.key === "Enter") {
      const newStatus = e.target.value;
      if (newStatus.trim() !== "") {
        try {
          // Update backend
          const response = await fetch(`${hostName}/user/update`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ status: newStatus }),
          });

          const json = await response.json();

          if (response.status !== 200) {
            toast({
              title: "Update failed",
              description: json.error || "Could not update status",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          } else {
            // Update local state and localStorage only after successful backend update
            setStatus(newStatus);
            const updatedUser = { ...user, status: newStatus };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast({
              title: "Status updated",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "bottom",
            });
          }
        } catch (error) {
          console.error("Error updating status:", error);
          toast({
            title: "Update failed",
            description: "An error occurred while updating status",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    }
  };

  const ProfileContent = () => (
    <VStack spacing={4} align="stretch">
      {/* Profile Header with Avatar */}
      <Flex direction="column" align="center" py={4}>
        <Box position="relative">
          {isUploading ? (
            <CircularProgress isIndeterminate color="#4f46e5" size="120px" />
          ) : (
            <Avatar
              size="2xl"
              name={user?.name}
              src={user?.profilePic}
              mb={4}
            />
          )}
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            display="none"
            onChange={handleProfilePicChange}
          />
          <IconButton
            icon={<FaCamera />}
            isRound
            size="sm"
            position="absolute"
            bottom={2}
            right={0}
            bg={props.colorMode === "dark" ? "gray.700" : "#4f46e5"}
            color="white"
            onClick={() => fileInputRef.current.click()}
            _hover={{
              bg: props.colorMode === "dark" ? "gray.600" : "#4338ca",
            }}
            isDisabled={isUploading}
          />
        </Box>
        <Editable
          defaultValue={user?.name}
          fontSize="xl"
          fontWeight="bold"
          onSubmit={handleNameChange}
          display="flex"
          alignItems="center"
        >
          {({ isEditing, onSubmit }) => (
            <>
              <EditablePreview />
              <EditableInput />
              {!isEditing && (
                <IconButton
                  icon={<FaPencilAlt />}
                  size="xs"
                  variant="ghost"
                  ml={2}
                />
              )}
            </>
          )}
        </Editable>
      </Flex>

      <Divider />

      {/* Status */}
      <FormControl>
        <Text fontSize="sm" color="gray.500" mb={1}>
          About
        </Text>
        <Input
          placeholder="Add a status..."
          defaultValue={status}
          onKeyPress={handleStatusChange}
        />
      </FormControl>

      <Divider />

      {/* Settings Options */}
      <VStack align="stretch" spacing={0}>
        <MenuItem
          icon={<FaBell />}
          label="Notifications"
          onClick={() => navigate("/settings")}
        />
        <MenuItem
          icon={<FaLock />}
          label="Privacy"
          onClick={() => navigate("/settings")}
        />
        <MenuItem
          icon={<FaQuestionCircle />}
          label="Help"
          onClick={() => navigate("/settings")}
        />
      </VStack>

      <Divider />

      {/* Logout Button */}
      <Box>
        <Button
          leftIcon={<FaSignOutAlt />}
          colorScheme="red"
          variant="ghost"
          width="full"
          justifyContent="flex-start"
          borderRadius="md"
          onClick={handleLogout}
          mb={4}
          _hover={{ bg: props.colorMode === "dark" ? "red.900" : "red.50" }}
        >
          Log out
        </Button>
      </Box>
    </VStack>
  );

  const MenuItem = ({ icon, label, onClick }) => (
    <Button
      leftIcon={icon}
      variant="ghost"
      width="full"
      justifyContent="flex-start"
      onClick={onClick}
      py={6}
    >
      {label}
    </Button>
  );

  return (
    <>
      {isMobile ? (
        <Drawer isOpen={props.isOpen} placement="left" onClose={props.onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Profile</DrawerHeader>
            <DrawerBody>
              <ProfileContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal isOpen={props.isOpen} onClose={props.onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <ProfileContent />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ProfileMenu;
