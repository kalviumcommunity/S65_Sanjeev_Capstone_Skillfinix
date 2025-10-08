import React, { useState } from "react";
import {
  Box,
  Image,
  Text,
  Button,
  Tooltip,
  Flex,
  Circle,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { CopyIcon, DeleteIcon, CheckCircleIcon } from "@chakra-ui/icons";
import DeleteMessageModal from "../miscellaneous/DeleteMessageModal";

const SingleMessage = ({
  message,
  user,
  receiver,
  markdownToHtml,
  scrollbarconfig,
  socket,
  activeChatId,
  removeMessageFromList,
  toast,
}) => {
  const isSender = message.senderId === user._id;
  
  // Format time like WhatsApp (HH:MM format with leading zeros)
  const hours = new Date(message.createdAt).getHours();
  const minutes = new Date(message.createdAt).getMinutes();
  const messageTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const [isHovered, setIsHovered] = useState(false);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      toast({
        duration: 1000,
        render: () => (
          <Box color="white" p={3} bg="purple.300" borderRadius="lg">
            Message copied to clipboard!!
          </Box>
        ),
      });
    });
  };

  const handleDeleteMessage = async (deletefrom) => {
    // Remove message from UI
    removeMessageFromList(message._id);
    onCloseDeleteModal();

    const deleteFrom = [user._id];
    if (deletefrom === 2) {
      deleteFrom.push(receiver._id);
    }

    const data = {
      messageId: message._id,
      conversationId: activeChatId,
      deleteFrom,
    };

    socket.emit("delete-message", data);
  };

  // Convert message text to HTML if it exists
  const renderMessageContent = () => {
    if (!message.text) {
      return <Text fontSize="sm">No content</Text>;
    }
    
    return (
      <Text
        overflowX="scroll"
        sx={scrollbarconfig}
        dangerouslySetInnerHTML={
          typeof markdownToHtml === 'function' && message.text
            ? markdownToHtml(message.text)
            : { __html: message.text }
        }
        fontSize="sm"
        mb={0}
      ></Text>
    );
  };

  return (
    <>
      <Flex
        justify={isSender ? "end" : "start"}
        mx={2}
        mb={1}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isSender && isHovered && (
          <Box margin={2} display="flex">
            <Tooltip label="Copy" placement="top">
              <Button
                size="sm"
                variant="ghost"
                mr={2}
                onClick={handleCopy}
                borderRadius="md"
              >
                <CopyIcon />
              </Button>
            </Tooltip>

            <Tooltip label="Delete" placement="top">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenDeleteModal();
                }}
                borderRadius="md"
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </Box>
        )}
        <Flex w="max-content" position="relative">
          {!isSender && receiver?.profilePic && (
            <Image
              borderRadius="50%"
              src={receiver.profilePic}
              alt="Sender"
              w="20px"
              h="20px"
              mr={1}
              alignSelf="flex-start"
              mt={1}
            />
          )}

          <Stack spacing={0} position="relative">
            {message.replyto && (
              <Box
                my={1}
                p={1}
                borderRadius={8}
                bg={isSender ? "purple.200" : "blue.200"}
                mx={1}
                color="white"
                w="max-content"
                maxW="60vw"
                alignSelf={isSender ? "flex-end" : "flex-start"}
              >
                reply to
              </Box>
            )}

            <Box
              alignSelf={isSender ? "flex-end" : "flex-start"}
              position="relative"
              my={0.5}
              px={2}
              py={1}
              borderRadius={8}
              bg={isSender ? "purple.300" : "blue.300"}
              color="white"
              w="max-content"
              maxW="60vw"
            >
              {message.imageUrl && (
                <Image
                  src={message.imageUrl}
                  alt="loading..."
                  w="200px"
                  maxW="40vw"
                  borderRadius="8px"
                  mb={1}
                />
              )}
              <Flex direction="column">
                {renderMessageContent()}
                
                <Flex 
                  justify="end" 
                  align="center" 
                  alignSelf="flex-end" 
                  ml={2}
                  mt={0}
                >
                  <Text 
                    fontSize="10px" 
                    color="#e6e5e5" 
                    lineHeight="1"
                  >
                    {messageTime}
                  </Text>

                  {isSender &&
                    message.seenBy?.find(
                      (element) => element.user === receiver._id
                    ) && (
                      <Circle ml={1} fontSize="x-small" color="green.100">
                        <CheckCircleIcon />
                      </Circle>
                    )}
                </Flex>
              </Flex>

              {message.reaction && (
                <Box
                  fontSize="xs"
                  position="absolute"
                  bg={isSender ? "purple.300" : "blue.300"}
                  bottom={-1}
                  left={-1}
                  borderRadius="lg"
                >
                  {message.reaction}
                </Box>
              )}

              {/* Hover controls */}
              {!isSender && isHovered && (
                <Box position="absolute" top="0" right="-50px" display="flex">
                  <Tooltip label="Copy" placement="top">
                    <Button
                      size="sm"
                      variant="ghost"
                      mr={2}
                      onClick={handleCopy}
                      borderRadius="md"
                    >
                      <CopyIcon />
                    </Button>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Stack>
        </Flex>
      </Flex>

      <DeleteMessageModal
        isOpen={isDeleteModalOpen}
        handleDeleteMessage={handleDeleteMessage}
        onClose={onCloseDeleteModal}
      />
    </>
  );
};

export default SingleMessage;