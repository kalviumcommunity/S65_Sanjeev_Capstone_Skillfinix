import React, { useContext, useRef, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Avatar,
  Input,
  useToast,
  Editable,
  EditableInput,
  EditablePreview,
  CircularProgress,
} from "@chakra-ui/react";
import { FaArrowLeft, FaCamera, FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import chatContext from "../../context/chatContext";

const Profile = () => {
  const context = useContext(chatContext);
  const { user, setUser, hostName } = context;
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef();
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(user?.status || "Learning and growing every day!");

  // App colors
  const bgColor = useColorModeValue("#f0f2f5", "#0b141a");
  const panelBg = useColorModeValue("#ffffff", "#202c33");
  const headerBg = useColorModeValue("#4f46e5", "#202c33");
  const textPrimary = useColorModeValue("#111b21", "#e9edef");
  const textSecondary = useColorModeValue("#667781", "#8696a0");
  const hoverBg = useColorModeValue("#f5f6f6", "#2a3942");
  const borderColor = useColorModeValue("#e9edef", "#313d45");
  const inputBg = useColorModeValue("#f0f2f5", "#2a3942");

  const handleProfilePicChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const base64Image = event.target.result;
        try {
          const response = await fetch(`${hostName}/user/update`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ profilePic: base64Image }),
          });
          
          const json = await response.json();
          if (response.status === 200) {
            const updatedUser = { ...user, profilePic: base64Image };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast({
              title: "Profile picture updated",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (error) {
          toast({
            title: "Upload failed",
            status: "error",
            duration: 3000,
          });
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = async (newName) => {
    if (newName.trim() !== "") {
      try {
        const response = await fetch(`${hostName}/user/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ name: newName }),
        });
        
        if (response.status === 200) {
          const updatedUser = { ...user, name: newName };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          toast({
            title: "Name updated",
            status: "success",
            duration: 2000,
          });
        }
      } catch (error) {
        toast({
          title: "Update failed",
          status: "error",
          duration: 3000,
        });
      }
    }
  };

  const handleStatusChange = async (e) => {
    if (e.key === "Enter") {
      const newStatus = e.target.value;
      if (newStatus.trim() !== "") {
        try {
          const response = await fetch(`${hostName}/user/update`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ status: newStatus }),
          });
          
          if (response.status === 200) {
            setStatus(newStatus);
            const updatedUser = { ...user, status: newStatus };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast({
              title: "Status updated",
              status: "success",
              duration: 2000,
            });
          }
        } catch (error) {
          toast({
            title: "Update failed",
            status: "error",
            duration: 3000,
          });
        }
      }
    }
  };

  return (
    <Flex h="100vh" bg={bgColor}>
      {/* Profile Panel */}
      <Box w="500px" bg={panelBg} borderRight="1px solid" borderColor={borderColor}>
        {/* Header */}
        <Box bg={headerBg} p={4}>
          <HStack spacing={4}>
            <IconButton
              icon={<FaArrowLeft />}
              variant="ghost"
              color="white"
              onClick={() => navigate("/settings")}
              _hover={{ bg: "whiteAlpha.200" }}
            />
            <Text color="white" fontSize="20px" fontWeight="500">
              My Profile
            </Text>
          </HStack>
        </Box>

        {/* Profile Content */}
        <VStack spacing={0} align="stretch">
          {/* Avatar Section */}
          <Flex justify="center" py={8} position="relative">
            <Box position="relative">
              {isUploading ? (
                <CircularProgress isIndeterminate size="150px" color="#4f46e5" />
              ) : (
                <Avatar size="2xl" src={user?.profilePic} name={user?.name} />
              )}
              <IconButton
                icon={<FaCamera />}
                isRound
                size="sm"
                position="absolute"
                bottom={2}
                right={2}
                bg="#4f46e5"
                color="white"
                onClick={() => fileInputRef.current.click()}
                _hover={{ bg: "#4338ca" }}
                isDisabled={isUploading}
              />
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                display="none"
                onChange={handleProfilePicChange}
              />
            </Box>
          </Flex>

          {/* Name Section */}
          <Box px={4} py={3} bg={panelBg}>
            <Text color={textSecondary} fontSize="14px" mb={2}>
              Display Name
            </Text>
            <Editable
              defaultValue={user?.name}
              onSubmit={handleNameChange}
              fontSize="17px"
              color={textPrimary}
            >
              {({ isEditing, onSubmit }) => (
                <HStack>
                  <EditablePreview width="full" />
                  <EditableInput bg={inputBg} />
                  {!isEditing && (
                    <IconButton
                      icon={<FaPencilAlt />}
                      size="xs"
                      variant="ghost"
                      color={textSecondary}
                    />
                  )}
                </HStack>
              )}
            </Editable>
          </Box>

          <Box h="10px" bg={bgColor} />

          {/* Status Section */}
          <Box px={4} py={3}>
            <Text color={textSecondary} fontSize="14px" mb={2}>
              Status Message
            </Text>
            <Input
              defaultValue={status}
              onKeyDown={handleStatusChange}
              fontSize="17px"
              color={textPrimary}
              border="none"
              bg="transparent"
              _focus={{ border: "none", boxShadow: "none" }}
              placeholder="Learning and growing every day!"
            />
          </Box>

          <Box h="10px" bg={bgColor} />

          {/* Phone Section */}
          <Box px={4} py={3}>
            <Text color={textSecondary} fontSize="14px" mb={2}>
              Contact Number
            </Text>
            <Text color={textPrimary} fontSize="17px">
              {user?.phone || "+91 87547 02812"}
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Right Empty Panel */}
      <Flex flex={1} align="center" justify="center" bg={bgColor}>
        <VStack spacing={4}>
          <Avatar size="2xl" src={user?.profilePic} name={user?.name} />
          <Text color={textPrimary} fontSize="24px" fontWeight="400">
            {user?.name}
          </Text>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default Profile;
