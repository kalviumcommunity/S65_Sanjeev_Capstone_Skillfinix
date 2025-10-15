import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabPanels,
  TabPanel,
  Button,
  Input,
  Stack,
  Text,
  Flex,
  IconButton,
  Image,
  Circle,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, EditIcon } from "@chakra-ui/icons";
import chatContext from "../../context/chatContext";
import _isEqual from "lodash/isEqual";
import { useToast } from "@chakra-ui/react";

export const ProfileModal = ({ isOpen, onClose, user, setUser }) => {
  const context = useContext(chatContext);
  const { hostName } = context;
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [showchangepassword, setshowchangepassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (!_isEqual(user, editedUser)) {
      setEditedUser(user);
    }
  }, [user]);

  // Profile photo upload handler
  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${hostName}/user/upload-profile-photo`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      
      // Update local state
      const updatedUser = { ...editedUser, profilePic: data.imageUrl };
      setEditedUser(updatedUser);
      setUser(updatedUser);
      context.setUser(updatedUser);

      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    try {
      setUser(editedUser);
    } catch (error) {}
    context.setUser(editedUser);

    try {
      const response = await fetch(`${hostName}/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(editedUser),
      });

      const json = await response.json();

      if (response.status !== 200) {
        toast({
          title: "An error occurred.",
          description: json.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "User updated",
          description: "User updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleMouseOver = () => {
    setShowEditIcon(true);
  };

  const handleMouseOut = () => {
    setShowEditIcon(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <IconButton
            icon={<EditIcon />}
            variant="ghost"
            colorScheme="purple"
            display={user._id !== context.user?._id ? "none" : "block"}
            onClick={handleEdit}
          />
          <Tabs onChange={(index) => setEditing(index === 1)}>
            <TabPanels>
              <TabPanel>
                <Stack spacing={4} alignItems="center">
                  {/* Profile Photo with Upload */}
                  <Box position="relative">
                    {isUploadingImage ? (
                      <Circle size="150px" bg="gray.200">
                        <Spinner size="xl" />
                      </Circle>
                    ) : (
                      <>
                        <Image
                          borderRadius="full"
                          boxSize="150px"
                          src={editedUser.profilePic || user.profilePic}
                          alt={user.name}
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                          cursor="pointer"
                          onClick={() => {
                            if (user._id === context.user?._id) {
                              fileInputRef.current?.click();
                            }
                          }}
                        />
                        {showEditIcon && user._id === context.user?._id && (
                          <Box
                            position="absolute"
                            bottom="5px"
                            right="5px"
                          >
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              colorScheme="blue"
                              borderRadius="full"
                              onClick={() => fileInputRef.current?.click()}
                            />
                          </Box>
                        )}
                      </>
                    )}
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfilePhotoUpload}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </Box>

                  <Text fontSize="xl" fontWeight="bold">
                    {user.name}
                  </Text>
                  <Text>About: {user.about}</Text>
                  <Text>email: {user.email}</Text>

                  {showEditIcon && user._id === context.user?._id && (
                    <Text fontSize="sm" color="gray.500">
                      click to edit profile photo
                    </Text>
                  )}

                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    onClick={() => setshowchangepassword(!showchangepassword)}
                    cursor="pointer"
                  >
                    <Text>change my password </Text>
                    {showchangepassword ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon />
                    )}
                  </Flex>

                  {showchangepassword && (
                    <Stack spacing={2}>
                      <Input
                        placeholder="Old password"
                        type="password"
                        name="oldpassword"
                        onChange={handleChange}
                      />
                      <Input
                        placeholder="New password"
                        type="password"
                        name="newpassword"
                        onChange={handleChange}
                      />
                    </Stack>
                  )}
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          {editing ? (
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button colorScheme="blue" mr={3} onClick={handleEdit}>
              Edit
            </Button>
          )}
          {editing && (
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Back
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
