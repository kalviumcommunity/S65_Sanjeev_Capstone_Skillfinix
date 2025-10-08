import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  Textarea,
  IconButton,
  useColorModeValue,
  Flex,
  useOutsideClick
} from "@chakra-ui/react";
import { FaMicrophone, FaSmile, FaPaperclip } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import chatContext from "../../context/chatContext";
import EmojiPicker from "./EmojiPicker";


export const ChatInput = ({ onSendMessage, onOpenFileUpload }) => {
  const context = useContext(chatContext);
  const { user, socket, activeChatId } = context;
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const emojiPickerRef = useRef();
  const textareaRef = useRef();


  // WhatsApp exact colors
  const containerBg = useColorModeValue("#FFFFFF", "#0B141A");
  const inputBg = useColorModeValue("#F0F2F5", "#2A3942"); // Changed type bar to grey
  const textColor = useColorModeValue("#3B4A54", "#E9EDEF");
  const placeholderColor = useColorModeValue("#8696A0", "#8696A0");
  const iconColor = useColorModeValue("#8696A0", "#8696A0");
  const sendBtnBg = "#00A884";
  const isDarkMode = useColorModeValue(false, true);


  // Close emoji picker when clicking outside
  useOutsideClick({
    ref: emojiPickerRef,
    handler: () => setIsEmojiPickerOpen(false),
  });


  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea to fit content
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };


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


    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }


    if (isEmojiPickerOpen) {
      setIsEmojiPickerOpen(false);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };


  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };


  const handleEmojiSelect = (emoji) => {
    setMessage(prevMessage => prevMessage + emoji);
    
    // Auto-resize after emoji insert
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
    }, 0);
  };


  return (
    <Box
      position="relative"
      bg={containerBg}
      px={4}
      pb={2}
      pt={0}
      mt={0}
    >
      {/* Emoji Picker */}
      {isEmojiPickerOpen && (
        <Box 
          ref={emojiPickerRef} 
          position="absolute" 
          bottom="48px" 
          left="20px" 
          right="20px"
          zIndex={1000}
        >
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setIsEmojiPickerOpen(false)}
            isDarkMode={isDarkMode}
          />
        </Box>
      )}


      {/* 🔥 EXACT WhatsApp Layout: Pin | Type Bar | Send */}
      <Flex align="center" gap={2}>
        
        {/* 🔥 PIN/ATTACHMENT BUTTON - OUTSIDE LEFT */}
        <IconButton
          icon={<FaPaperclip />}
          aria-label="Attach file"
          variant="ghost"
          color={iconColor}
          _hover={{ 
            bg: useColorModeValue("gray.100", "#374045"),
          }}
          onClick={onOpenFileUpload}
          size="md"
          w="40px"
          h="40px"
          borderRadius="full"
          flexShrink={0}
        />


        {/* 🔥 TYPE BAR - Perfect WhatsApp Auto-Expanding Style */}
        <Flex
          flex="1"
          align="center"
          bg={inputBg}
          borderRadius="24px"
          minH="42px"
          maxH="none"
          px={3}
          py="6px"
          gap={2}
        >
          
          {/* 🔥 EMOJI BUTTON - INSIDE Type Bar */}
          <IconButton
            icon={<FaSmile />}
            aria-label="Add emoji"
            variant="ghost"
            color={iconColor}
            _hover={{ bg: "transparent" }}
            onClick={toggleEmojiPicker}
            size="sm"
            w="28px"
            h="28px"
            borderRadius="full"
            minW="28px"
            flexShrink={0}
          />


          {/* 🔥 TEXT INPUT - Auto-expanding like WhatsApp */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyPress}
            placeholder="Type a message"
            variant="unstyled"
            color={textColor}
            fontSize="15px"
            flex="1"
            minH="20px"
            maxH="200px"
            h="auto"
            rows={1}
            resize="none"
            overflow="auto"
            lineHeight="1.5"
            _placeholder={{
              color: placeholderColor,
              fontSize: "15px",
            }}
            sx={{
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: useColorModeValue('#c1c1c1', '#5a5a5a'),
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: useColorModeValue('#a8a8a8', '#6e6e6e'),
              },
            }}
          />


        </Flex>


        {/* 🔥 SEND/MIC BUTTON - OUTSIDE RIGHT */}
        <IconButton
          icon={message.trim() === "" ? <FaMicrophone /> : <IoSend />}
          aria-label={message.trim() === "" ? "Voice message" : "Send message"}
          bg={sendBtnBg}
          color="white"
          _hover={{ bg: "#128C7E" }}
          _active={{ bg: "#075E54" }}
          onClick={message.trim() === "" ? undefined : handleSendMessage}
          size="md"
          w="48px"
          h="48px"
          borderRadius="full"
          flexShrink={0}
          transition="all 0.15s ease"
          boxShadow="0 1px 3px rgba(0, 0, 0, 0.12)"
        />
        
      </Flex>
    </Box>
  );
};


export default ChatInput;