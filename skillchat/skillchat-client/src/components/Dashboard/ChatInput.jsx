import React, { useState, useEffect, useContext, useRef } from "react";
import { 
  Box, 
  Input, 
  IconButton, 
  FormControl, 
  useColorModeValue,
  Grid,
  GridItem,
  Text,
  Tooltip,
  useOutsideClick
} from "@chakra-ui/react";
import { FaPlus, FaMicrophone, FaSmile, FaTimes, FaImage, FaFileAlt, FaCamera, FaUser, FaPoll } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import chatContext from "../../context/chatContext";
import EmojiPicker from "./EmojiPicker";

export const ChatInput = ({ onSendMessage, onOpenFileUpload }) => {
  const context = useContext(chatContext);
  const { user, socket, activeChatId } = context;
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const emojiPickerRef = useRef();
  
  // WhatsApp-like colors with dark mode support
  const containerBg = useColorModeValue("gray.100", "#0B141A");
  const inputBgColor = useColorModeValue("white", "#1F2C34");
  const iconColor = useColorModeValue("gray.500", "gray.400");
  const attachmentBg = useColorModeValue("white", "#1F2C34");
  const attachmentIconBg = useColorModeValue("gray.100", "#2D3B43");
  const attachmentTextColor = useColorModeValue("gray.600", "gray.300");
  const inputTextColor = useColorModeValue("gray.800", "white");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");
  const isDarkMode = useColorModeValue(false, true);

  // Close emoji picker when clicking outside
  useOutsideClick({
    ref: emojiPickerRef,
    handler: () => setIsEmojiPickerOpen(false),
  });

  useEffect(() => {
    if (message === "" && typing) {
      setTyping(false);
      socket.emit("stop-typing", {
        typer: user._id,
        conversationId: activeChatId,
      });
    } else if (message !== "" && !typing) {
      setTyping(true);
      socket.emit("typing", {
        typer: user._id,
        conversationId: activeChatId,
      });
    }
  }, [message, typing, socket, user._id, activeChatId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    
    onSendMessage(e, message);
    setMessage("");
    setTyping(false);
    // Close attachment menu and emoji picker if open
    if (attachmentMenuOpen) {
      setAttachmentMenuOpen(false);
    }
    if (isEmojiPickerOpen) {
      setIsEmojiPickerOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  const toggleAttachmentMenu = () => {
    setAttachmentMenuOpen(!attachmentMenuOpen);
    // Close emoji picker if open
    if (isEmojiPickerOpen) {
      setIsEmojiPickerOpen(false);
    }
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
    // Close attachment menu if open
    if (attachmentMenuOpen) {
      setAttachmentMenuOpen(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prevMessage => prevMessage + emoji);
  };

  // Attachment options, similar to WhatsApp
  const attachmentOptions = [
    { icon: FaFileAlt, label: "Document", action: onOpenFileUpload, color: "#5157AE" },
    { icon: FaImage, label: "Photos & Videos", action: onOpenFileUpload, color: "#A157AE" },
    { icon: FaCamera, label: "Camera", action: () => {}, color: "#D52C5D" },
    { icon: FaUser, label: "Barters", action: () => {}, color: "#0BAF53" },
    { icon: FaPoll, label: "SkillVote", action: () => {}, color: "#F5BB3C" }
  ];

  return (
    <Box
      py={2}
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      width="100%"
      backgroundColor={containerBg}
      px={2}
    >
      <FormControl>
        {/* Attachment menu that slides in from bottom when plus is clicked */}
        <AnimatePresence>
          {attachmentMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                bottom: "62px",
                left: "10px",
                zIndex: 10
              }}
            >
              <Box 
                bg={attachmentBg} 
                borderRadius="lg"
                boxShadow="lg"
                p={3}
                width="fit-content"
              >
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  {attachmentOptions.map((option, index) => (
                    <GridItem key={index}>
                      <Tooltip label={option.label} placement="top">
                        <Box 
                          display="flex" 
                          flexDirection="column" 
                          alignItems="center"
                          cursor="pointer"
                          onClick={option.action}
                        >
                          <Box 
                            bg={attachmentIconBg} 
                            p={3} 
                            borderRadius="full" 
                            color={option.color}
                            mb={1}
                          >
                            <option.icon size={20} />
                          </Box>
                          <Text fontSize="xs" color={attachmentTextColor}>
                            {option.label}
                          </Text>
                        </Box>
                      </Tooltip>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emoji Picker */}
        <AnimatePresence>
          {isEmojiPickerOpen && (
            <motion.div
              ref={emojiPickerRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                bottom: "62px",
                left: "10px",
                zIndex: 10,
                width: "340px"
              }}
            >
              <EmojiPicker 
                onSelectEmoji={handleEmojiSelect}
                onClose={() => setIsEmojiPickerOpen(false)}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Box display="flex" alignItems="center" width="100%">
          {/* Plus/X button with animation */}
          <Box mr={2}>
            <IconButton
              icon={attachmentMenuOpen ? <FaTimes /> : <FaPlus />}
              aria-label={attachmentMenuOpen ? "Close menu" : "Attach file"}
              size="sm"
              isRound
              colorScheme={attachmentMenuOpen ? "red" : "gray"}
              variant={attachmentMenuOpen ? "solid" : "ghost"}
              color={attachmentMenuOpen ? "white" : iconColor}
              onClick={toggleAttachmentMenu}
              transition="all 0.2s"
            />
          </Box>

          {/* Input Field with boxy WhatsApp-like styling - PRESERVING ORIGINAL STYLE */}
          <Box
            flex="1"
            bg={inputBgColor}
            borderRadius="md"
            display="flex"
            alignItems="center"
            pl={4}
            pr={2}
            py={1}
            boxShadow="sm"
          >
            {/* Emoji icon button that toggles the emoji picker */}
            <IconButton
              icon={<FaSmile />}
              aria-label="Emoji"
              size="sm"
              variant="ghost"
              color={isEmojiPickerOpen ? "#00A884" : iconColor}
              mr={2}
              minW="auto"
              h="auto"
              onClick={toggleEmojiPicker}
            />

            <Input
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              border="none"
              color={inputTextColor}
              _focus={{
                boxShadow: "none",
              }}
              _placeholder={{
                color: placeholderColor,
                fontSize: "sm",
              }}
              fontSize="sm"
              p={0}
              h="36px"
            />
          </Box>

          {/* Right icon (Mic or Send) - OUTSIDE the input bar */}
          <Box ml={2}>
            {message.trim() === "" ? (
              <IconButton
                icon={<FaMicrophone />}
                aria-label="Voice message"
                size="sm"
                isRound
                colorScheme="teal"
                color="white"
                bg="#00A884"
                _hover={{ bg: "#009670" }}
              />
            ) : (
              <IconButton
                icon={<IoSend />}
                aria-label="Send message"
                size="sm"
                isRound
                colorScheme="teal"
                color="white"
                bg="#00A884"
                _hover={{ bg: "#009670" }}
                onClick={handleSendMessage}
              />
            )}
          </Box>
        </Box>
      </FormControl>
    </Box>
  );
};

export default ChatInput;