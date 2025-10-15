import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Avatar,
  Text,
  Box,
  IconButton,
  Input,
  Textarea,
  useToast,
  Divider,
  Badge,
  useDisclosure,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import {
  EditIcon,
  CopyIcon,
  AddIcon,
  LinkIcon,
  SettingsIcon,
  AttachmentIcon,
} from "@chakra-ui/icons";
import chatContext from "../../context/chatContext";

const GroupInfoModal = ({ isOpen, onClose, conversation }) => {
  const context = useContext(chatContext);
  const { user, hostName, setMyChatList, myChatList } = context;
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupIcon, setGroupIcon] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const {
    isOpen: isAddMemberOpen,
    onOpen: onAddMemberOpen,
    onClose: onAddMemberClose,
  } = useDisclosure();

  useEffect(() => {
    if (conversation) {
      setGroupName(conversation.groupName || "");
      setGroupDescription(conversation.groupDescription || "");
      setGroupIcon(conversation.groupIcon || "");

      // Check if current user is admin
      const userIsAdmin = conversation.admins?.some(
        (admin) => admin._id === user._id || admin === user._id
      );
      setIsAdmin(userIsAdmin);

      // Check if current user is creator
      const userIsCreator =
        conversation.createdBy?._id === user._id ||
        conversation.createdBy === user._id;
      setIsCreator(userIsCreator);

      // Get invite link if exists
      if (conversation.inviteLink && conversation.inviteLinkEnabled) {
        setInviteLink(
          `${window.location.origin}/join/${conversation.inviteLink}`
        );
      }
    }
  }, [conversation, user._id]);

  // 🔥 FIXED: Handle image upload with auto-save to database
  const handleImageUpload = async (e) => {
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
      // Step 1: Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(
        `${hostName}/conversation/group/upload-icon`,
        {
          method: "POST",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.imageUrl;

      // Step 2: Save to database immediately
      const updateResponse = await fetch(
        `${hostName}/conversation/group/update-info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            conversationId: conversation._id,
            groupIcon: imageUrl,
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to save group icon");
      }

      const updatedConversation = await updateResponse.json();

      // Step 3: Update local state and chat list
      setGroupIcon(imageUrl);
      setMyChatList(
        myChatList.map((chat) =>
          chat._id === conversation._id ? updatedConversation : chat
        )
      );

      toast({
        title: "Success",
        description: "Group icon updated successfully",
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

  const handleUpdateGroupInfo = async () => {
    try {
      const response = await fetch(`${hostName}/conversation/group/update-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          conversationId: conversation._id,
          groupName,
          groupDescription,
          groupIcon,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update group info");
      }

      const data = await response.json();

      // Update chat list
      setMyChatList(
        myChatList.map((chat) =>
          chat._id === conversation._id ? data : chat
        )
      );

      toast({
        title: "Group updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error updating group",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGenerateInviteLink = async () => {
    try {
      const response = await fetch(
        `${hostName}/conversation/group/generate-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            conversationId: conversation._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate invite link");
      }

      const data = await response.json();
      setInviteLink(data.inviteLink);

      toast({
        title: "Invite link generated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error generating link",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link copied",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleRevokeInviteLink = async () => {
    try {
      const response = await fetch(
        `${hostName}/conversation/group/revoke-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            conversationId: conversation._id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to revoke invite link");
      }

      setInviteLink("");
      toast({
        title: "Invite link revoked",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error revoking link",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMakeAdmin = async (memberId) => {
    try {
      const response = await fetch(`${hostName}/conversation/group/make-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          conversationId: conversation._id,
          memberId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to make admin");
      }

      const data = await response.json();
      setMyChatList(
        myChatList.map((chat) =>
          chat._id === conversation._id ? data : chat
        )
      );

      toast({
        title: "Member promoted to admin",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error making admin",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDismissAdmin = async (adminId) => {
    try {
      const response = await fetch(
        `${hostName}/conversation/group/dismiss-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            conversationId: conversation._id,
            adminId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to dismiss admin");
      }

      const data = await response.json();
      setMyChatList(
        myChatList.map((chat) =>
          chat._id === conversation._id ? data : chat
        )
      );

      toast({
        title: "Admin dismissed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error dismissing admin",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await fetch(
        `${hostName}/conversation/group/remove-member`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            conversationId: conversation._id,
            memberId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove member");
      }

      const data = await response.json();
      setMyChatList(
        myChatList.map((chat) =>
          chat._id === conversation._id ? data : chat
        )
      );

      toast({
        title: "Member removed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error removing member",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const response = await fetch(`${hostName}/conversation/group/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          conversationId: conversation._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to leave group");
      }

      setMyChatList(myChatList.filter((chat) => chat._id !== conversation._id));

      toast({
        title: "Left group",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error leaving group",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const memberIsAdmin = (memberId) => {
    return conversation.admins?.some(
      (admin) => admin._id === memberId || admin === memberId
    );
  };

  const memberIsCreator = (memberId) => {
    return (
      conversation.createdBy?._id === memberId ||
      conversation.createdBy === memberId
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Group Info</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Group Icon and Name */}
            <VStack spacing={3}>
              {/* 🔥 Avatar with upload functionality */}
              <Box position="relative">
                {isUploadingImage ? (
                  <Box
                    width="100px"
                    height="100px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    bg="gray.100"
                  >
                    <Spinner size="xl" />
                  </Box>
                ) : (
                  <>
                    <Avatar
                      size="2xl"
                      name={groupName}
                      src={groupIcon}
                      cursor={isAdmin ? "pointer" : "default"}
                      onClick={() => isAdmin && fileInputRef.current?.click()}
                    />
                    {isAdmin && (
                      <IconButton
                        icon={<AttachmentIcon />}
                        size="sm"
                        colorScheme="blue"
                        borderRadius="full"
                        position="absolute"
                        bottom="0"
                        right="0"
                        onClick={() => fileInputRef.current?.click()}
                      />
                    )}
                  </>
                )}
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </Box>

              {isEditing ? (
                <>
                  <Input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Group name"
                    size="lg"
                    fontWeight="bold"
                    textAlign="center"
                  />
                  <Textarea
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="Group description"
                    size="sm"
                  />
                </>
              ) : (
                <>
                  <HStack>
                    <Text fontSize="xl" fontWeight="bold">
                      {groupName}
                    </Text>
                    {isAdmin && (
                      <IconButton
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                      />
                    )}
                  </HStack>
                  {groupDescription && (
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      {groupDescription}
                    </Text>
                  )}
                </>
              )}

              {/* Group Stats */}
              <HStack spacing={4}>
                <Text fontSize="sm" color="gray.600">
                  {conversation.members?.length || 0} members
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {conversation.admins?.length || 0} admins
                </Text>
              </HStack>
            </VStack>

            <Divider />

            {/* Invite Link Section */}
            {isAdmin && (
              <>
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Invite Link
                  </Text>
                  {inviteLink ? (
                    <HStack>
                      <Input value={inviteLink} isReadOnly size="sm" />
                      <IconButton
                        icon={<CopyIcon />}
                        onClick={handleCopyInviteLink}
                        colorScheme="blue"
                        size="sm"
                      />
                      <Button
                        onClick={handleRevokeInviteLink}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                      >
                        Revoke Link
                      </Button>
                    </HStack>
                  ) : (
                    <Button
                      leftIcon={<LinkIcon />}
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateInviteLink}
                    >
                      Generate Invite Link
                    </Button>
                  )}
                </Box>
                <Divider />
              </>
            )}

            {/* Members List */}
            <Box>
              <HStack justify="space-between" mb={3}>
                <Text fontWeight="bold">Members</Text>
                {isAdmin && (
                  <IconButton
                    icon={<AddIcon />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={onAddMemberOpen}
                  />
                )}
              </HStack>

              <VStack align="stretch" spacing={2}>
                {conversation.members?.map((member) => (
                  <HStack
                    key={member._id}
                    p={2}
                    borderRadius="md"
                    bg={bgColor}
                    borderWidth="1px"
                    borderColor={borderColor}
                    justify="space-between"
                  >
                    <HStack>
                      <Avatar size="sm" name={member.name} src={member.profilePic} />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {member.name}
                          {member._id === user._id && " (You)"}
                        </Text>
                        {memberIsAdmin(member._id) && (
                          <Badge
                            colorScheme={memberIsCreator(member._id) ? "purple" : "blue"}
                            size="sm"
                          >
                            {memberIsCreator(member._id) ? "Creator" : "Admin"}
                          </Badge>
                        )}
                      </VStack>
                    </HStack>

                    {isAdmin && member._id !== user._id && (
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<SettingsIcon />}
                          size="sm"
                          variant="ghost"
                        />
                        <MenuList>
                          {!memberIsAdmin(member._id) ? (
                            <MenuItem
                              onClick={() => handleMakeAdmin(member._id)}
                            >
                              Make Admin
                            </MenuItem>
                          ) : (
                            !memberIsCreator(member._id) && (
                              <MenuItem
                                onClick={() => handleDismissAdmin(member._id)}
                              >
                                Dismiss as Admin
                              </MenuItem>
                            )
                          )}
                          {!memberIsCreator(member._id) && (
                            <MenuItem
                              onClick={() => handleRemoveMember(member._id)}
                              color="red.500"
                            >
                              Remove from Group
                            </MenuItem>
                          )}
                        </MenuList>
                      </Menu>
                    )}
                  </HStack>
                ))}
              </VStack>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleUpdateGroupInfo}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                colorScheme="red"
                variant="ghost"
                onClick={handleLeaveGroup}
              >
                Leave Group
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GroupInfoModal;
