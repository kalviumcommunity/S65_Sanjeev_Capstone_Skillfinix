import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Switch,
  useColorMode,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaChevronRight,
  FaPalette,
  FaImage,
  FaCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import chatContext from "../../context/chatContext";

const ChatSettings = () => {
  const context = useContext(chatContext);
  const { user } = context;
  const navigate = useNavigate();
  const { colorMode, setColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Theme state: 'light', 'dark', or 'system'
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("theme-preference") || "system";
  });

  // App colors
  const bgColor = useColorModeValue("#f0f2f5", "#0b141a");
  const panelBg = useColorModeValue("#ffffff", "#202c33");
  const headerBg = useColorModeValue("#4f46e5", "#202c33");
  const textPrimary = useColorModeValue("#111b21", "#e9edef");
  const textSecondary = useColorModeValue("#667781", "#8696a0");
  const hoverBg = useColorModeValue("#f5f6f6", "#2a3942");
  const borderColor = useColorModeValue("#e9edef", "#313d45");
  const sectionHeaderBg = useColorModeValue("#f0f2f5", "#0b141a");
  const modalBg = useColorModeValue("#ffffff", "#202c33");

  const [spellCheck, setSpellCheck] = useState(true);
  const [replaceEmoji, setReplaceEmoji] = useState(true);
  const [enterIsSend, setEnterIsSend] = useState(true);

  // Apply theme on mount and when themeMode changes
  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  const applyTheme = (mode) => {
    if (mode === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const newColorMode = systemPrefersDark ? "dark" : "light";
      setColorMode(newColorMode);
      localStorage.setItem("chakra-ui-color-mode", newColorMode);
    } else {
      setColorMode(mode);
      localStorage.setItem("chakra-ui-color-mode", mode);
    }
    localStorage.setItem("theme-preference", mode);
  };

  const handleThemeChange = (value) => {
    setThemeMode(value);
    applyTheme(value);
    onClose();
  };

  const getThemeLabel = () => {
    if (themeMode === "light") return "Light theme";
    if (themeMode === "dark") return "Dark theme";
    return "Auto (system)";
  };

  const SettingsItem = ({ icon, label, description, onClick, showArrow = true }) => (
    <Box
      as="button"
      w="full"
      px={4}
      py={3}
      onClick={onClick}
      _hover={{ bg: hoverBg }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <HStack spacing={4} align="center">
        {icon && (
          <Box fontSize="20px" color={textSecondary}>
            {icon}
          </Box>
        )}
        <VStack align="start" spacing={0} flex={1}>
          <Text color={textPrimary} fontSize="16px" fontWeight="400">
            {label}
          </Text>
          {description && (
            <Text color={textSecondary} fontSize="14px">
              {description}
            </Text>
          )}
        </VStack>
        {showArrow && <FaChevronRight color={textSecondary} size={14} />}
      </HStack>
    </Box>
  );

  const ToggleItem = ({ label, description, checked, onChange }) => (
    <Box w="full" px={4} py={3}>
      <HStack spacing={4} align="center" justify="space-between">
        <VStack align="start" spacing={0} flex={1}>
          <Text color={textPrimary} fontSize="16px" fontWeight="400">
            {label}
          </Text>
          {description && (
            <Text color={textSecondary} fontSize="14px">
              {description}
            </Text>
          )}
        </VStack>
        <Switch
          colorScheme="purple"
          size="lg"
          isChecked={checked}
          onChange={onChange}
        />
      </HStack>
    </Box>
  );

  const SectionHeader = ({ title }) => (
    <Box w="full" px={4} py={2} bg={sectionHeaderBg}>
      <Text color={textSecondary} fontSize="13px" fontWeight="500">
        {title}
      </Text>
    </Box>
  );

  const ThemeOption = ({ value, label, isSelected, onClick }) => (
    <Box
      as="button"
      w="full"
      px={4}
      py={3}
      onClick={onClick}
      _hover={{ bg: hoverBg }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <HStack spacing={4} justify="space-between">
        <Text color={textPrimary} fontSize="16px" fontWeight="400">
          {label}
        </Text>
        {isSelected && (
          <Box color="#4f46e5" fontSize="20px">
            <FaCheck />
          </Box>
        )}
      </HStack>
    </Box>
  );

  return (
    <Flex h="100vh" bg={bgColor}>
      {/* Chat Settings Panel */}
      <Box
        w="500px"
        bg={panelBg}
        borderRight="1px solid"
        borderColor={borderColor}
        overflowY="auto"
      >
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
              Conversations
            </Text>
          </HStack>
        </Box>

        <VStack spacing={0} align="stretch">
          {/* Display Section */}
          <SectionHeader title="Appearance" />

          {/* Theme Option - CLICKABLE */}
          <Box
            as="button"
            w="full"
            px={4}
            py={3}
            onClick={onOpen}
            _hover={{ bg: hoverBg }}
            transition="all 0.2s"
            cursor="pointer"
          >
            <HStack spacing={4} align="center" justify="space-between">
              <HStack spacing={4} flex={1}>
                <Box fontSize="20px" color={textSecondary}>
                  <FaPalette />
                </Box>
                <VStack align="start" spacing={0}>
                  <Text color={textPrimary} fontSize="16px" fontWeight="400">
                    Color Theme
                  </Text>
                  <Text color={textSecondary} fontSize="14px">
                    {getThemeLabel()}
                  </Text>
                </VStack>
              </HStack>
              <FaChevronRight color={textSecondary} size={14} />
            </HStack>
          </Box>

          <SettingsItem icon={<FaImage />} label="Background Image" showArrow={true} />

          <Box h="10px" bg={bgColor} />

          {/* Chat Settings Section */}
          <SectionHeader title="Message Options" />

          <SettingsItem label="File Upload Quality" showArrow={true} />

          <SettingsItem label="Auto-Save Media" showArrow={true} />

          <Divider borderColor={borderColor} />

          {/* Toggle Options */}
          <ToggleItem
            label="Check Spelling"
            description="Automatically check spelling as you type"
            checked={spellCheck}
            onChange={() => setSpellCheck(!spellCheck)}
          />

          <Divider borderColor={borderColor} />

          <ToggleItem
            label="Auto Emoji Conversion"
            description="Convert text shortcuts to emoji automatically"
            checked={replaceEmoji}
            onChange={() => setReplaceEmoji(!replaceEmoji)}
          />

          <Divider borderColor={borderColor} />

          <ToggleItem
            label="Quick Send Mode"
            description="Press Enter to send messages instantly"
            checked={enterIsSend}
            onChange={() => setEnterIsSend(!enterIsSend)}
          />
        </VStack>
      </Box>

      {/* Right Empty Panel */}
      <Flex flex={1} align="center" justify="center" bg={bgColor}>
        <VStack spacing={4}>
          <Box fontSize="60px">💬</Box>
          <Text color={textSecondary} fontSize="32px" fontWeight="300">
            Conversations
          </Text>
          <Text
            color={textSecondary}
            fontSize="14px"
            textAlign="center"
            maxW="400px"
          >
            Personalize your messaging experience
          </Text>
        </VStack>
      </Flex>

      {/* Theme Selection Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent bg={modalBg} borderRadius="md">
          <ModalHeader color={textPrimary}>Choose Color Theme</ModalHeader>
          <ModalCloseButton color={textSecondary} />
          <ModalBody pb={6}>
            <VStack spacing={0} align="stretch">
              <ThemeOption
                value="light"
                label="Light theme"
                isSelected={themeMode === "light"}
                onClick={() => handleThemeChange("light")}
              />
              <Divider borderColor={borderColor} />
              <ThemeOption
                value="dark"
                label="Dark theme"
                isSelected={themeMode === "dark"}
                onClick={() => handleThemeChange("dark")}
              />
              <Divider borderColor={borderColor} />
              <ThemeOption
                value="system"
                label="Auto (system)"
                isSelected={themeMode === "system"}
                onClick={() => handleThemeChange("system")}
              />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ChatSettings;
