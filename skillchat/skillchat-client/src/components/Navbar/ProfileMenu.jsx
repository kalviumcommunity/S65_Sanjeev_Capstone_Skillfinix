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
  CircularProgress
} from "@chakra-ui/react";
import { 
  FaCamera, 
  FaPencilAlt, 
  FaSignOutAlt, 
  FaCheck, 
  FaBell, 
  FaLock, 
  FaQuestionCircle,
  FaUserCircle
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
    socket
  } = context;
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isUploading, setIsUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [status, setStatus] = useState(user?.status || "Chatting, laughing, and knowledge stacking 😄💬📚");

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
      position: "bottom"
    });
    
    // Navigate to login page with replace to prevent back navigation
    navigate("/", { replace: true });
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUser({ ...user, profilePic: e.target.result });
          // Update localStorage to ensure persistence
          localStorage.setItem("user", JSON.stringify({...user, profilePic: e.target.result}));
          // In a real app, you would save this to your backend
        };
        reader.readAsDataURL(e.target.files[0]);
        setIsUploading(false);
        
        toast({
          title: "Profile picture updated",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom"
        });
      }, 1500);
    }
  };

  const handleNameChange = (newName) => {
    if (newName.trim() !== "") {
      const updatedUser = { ...user, name: newName };
      setUser(updatedUser);
      // Update localStorage to ensure persistence
      localStorage.setItem("user", JSON.stringify(updatedUser));
      // In a real app, you would save this to your backend
      toast({
        title: "Name updated",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom"
      });
    }
  };

  const handleStatusChange = (e) => {
    if (e.key === 'Enter') {
      const newStatus = e.target.value;
      if (newStatus.trim() !== "") {
        setStatus(newStatus);
        const updatedUser = { ...user, status: newStatus };
        setUser(updatedUser);
        // Update localStorage to ensure persistence
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // In a real app, you would save this to your backend
        toast({
          title: "Status updated",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom"
        });
      }
    }
  };

  const ProfileContent = () => (
    <Box px={2}>
      {/* Profile Header with Avatar */}
      <Flex 
        direction="column" 
        align="center" 
        justify="center" 
        position="relative"
        py={6}
        bg={props.colorMode === "dark" ? "gray.800" : "teal.50"}
        borderRadius="lg"
        mb={4}
      >
        <Box position="relative">
          {isUploading ? (
            <Box 
              position="relative" 
              width="120px" 
              height="120px" 
              borderRadius="full" 
              display="flex" 
              justifyContent="center" 
              alignItems="center"
              bg={props.colorMode === "dark" ? "gray.700" : "gray.100"}
            >
              <CircularProgress isIndeterminate color="teal.500" />
            </Box>
          ) : (
            <Avatar
              size="2xl"
              name={user?.name || "User"}
              src={user?.profilePic}
              mb={2}
            />
          )}
          
          <IconButton
            aria-label="Change profile picture"
            icon={<FaCamera />}
            isRound
            size="sm"
            position="absolute"
            bottom={2}
            right={0}
            bg={props.colorMode === "dark" ? "gray.700" : "teal.500"}
            color="white"
            onClick={() => fileInputRef.current.click()}
            _hover={{ bg: props.colorMode === "dark" ? "gray.600" : "teal.600" }}
          />
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={handleProfilePicChange}
          />
        </Box>
        
        <Box mt={4} textAlign="center" width="full">
          <Editable
            defaultValue={user?.name || "User"}
            isPreviewFocusable={false}
            submitOnBlur={true}
            onSubmit={handleNameChange}
            width="full"
          >
            {({ isEditing, onSubmit }) => (
              <>
                <Flex align="center" justify="center">
                  <EditablePreview
                    fontWeight="bold"
                    fontSize="xl"
                    _hover={{
                      bg: props.colorMode === "dark" ? "gray.700" : "gray.100",
                      cursor: "pointer"
                    }}
                  />
                  <EditableInput 
                    textAlign="center" 
                    fontWeight="bold"
                    fontSize="xl"
                  />
                  {!isEditing && (
                    <IconButton
                      aria-label="Edit name"
                      icon={<FaPencilAlt />}
                      size="xs"
                      variant="ghost"
                      ml={2}
                    />
                  )}
                </Flex>
              </>
            )}
          </Editable>
        </Box>
      </Flex>

      {/* Status */}
      <Box 
        p={4} 
        bg={props.colorMode === "dark" ? "gray.800" : "white"} 
        borderRadius="md"
        boxShadow="sm"
        mb={4}
      >
        <HStack color="gray.500" mb={2}>
          <FaUserCircle />
          <Text fontSize="sm">About</Text>
        </HStack>
        <Input
          variant="unstyled"
          defaultValue={status}
          fontSize="md"
          onKeyPress={handleStatusChange}
          pl={1}
        />
      </Box>

      {/* Settings Options */}
      <VStack 
        spacing={0} 
        align="stretch" 
        bg={props.colorMode === "dark" ? "gray.800" : "white"}
        borderRadius="md"
        boxShadow="sm"
        mb={4}
        divider={<Divider />}
      >
        <MenuItem
          icon={<FaBell color={props.colorMode === "dark" ? "#A0AEC0" : "#4A5568"} />}
          label="Notifications"
        />
        <MenuItem
          icon={<FaLock color={props.colorMode === "dark" ? "#A0AEC0" : "#4A5568"} />}
          label="Privacy"
        />
        <MenuItem
          icon={<FaQuestionCircle color={props.colorMode === "dark" ? "#A0AEC0" : "#4A5568"} />}
          label="Help"
        />
      </VStack>

      {/* Logout Button */}
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
  );

  const MenuItem = ({ icon, label, onClick }) => (
    <Flex
      p={4}
      align="center"
      _hover={{ bg: props.colorMode === "dark" ? "gray.700" : "gray.50" }}
      cursor="pointer"
      onClick={onClick}
    >
      <Box mr={3}>
        {icon}
      </Box>
      <Text>{label}</Text>
    </Flex>
  );

  return (
    <>
      {isMobile ? (
        <Drawer isOpen={props.isOpen} placement="right" onClose={props.onClose} size="full">
          <DrawerOverlay />
          <DrawerContent bg={props.colorMode === "dark" ? "gray.900" : "gray.50"}>
            <DrawerHeader 
              borderBottomWidth="1px" 
              bg={props.colorMode === "dark" ? "gray.800" : "teal.600"}
              color="white"
            >
              <HStack>
                <DrawerCloseButton position="relative" left={-4} top={0} />
                <Text>Profile</Text>
              </HStack>
            </DrawerHeader>
            <DrawerBody p={3}>
              <ProfileContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal 
          isOpen={props.isOpen} 
          onClose={props.onClose} 
          isCentered 
          size="md"
          motionPreset="slideInBottom"
        >
          <ModalOverlay backdropFilter="blur(3px)" bg="blackAlpha.300" />
          <ModalContent 
            bg={props.colorMode === "dark" ? "gray.900" : "gray.50"}
            borderRadius="lg"
            overflow="hidden"
            maxH="85vh"
          >
            <ModalHeader 
              bg={props.colorMode === "dark" ? "gray.800" : "teal.600"}
              color="white"
              py={3}
            >
              Profile
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={3} overflowY="auto">
              <ProfileContent />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ProfileMenu;