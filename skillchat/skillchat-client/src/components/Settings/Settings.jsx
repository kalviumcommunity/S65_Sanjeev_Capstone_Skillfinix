import React, { useContext } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaKey,
  FaBell,
  FaLock,
  FaQuestionCircle,
  FaInfoCircle,
  FaChevronRight,
  FaComments,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import chatContext from "../../context/chatContext";

const Settings = () => {
  const context = useContext(chatContext);
  const { user } = context;
  const navigate = useNavigate();

  // App colors
  const bgColor = useColorModeValue("#f0f2f5", "#0b141a");
  const panelBg = useColorModeValue("#ffffff", "#202c33");
  const headerBg = useColorModeValue("#4f46e5", "#202c33");
  const textPrimary = useColorModeValue("#111b21", "#e9edef");
  const textSecondary = useColorModeValue("#667781", "#8696a0");
  const hoverBg = useColorModeValue("#f5f6f6", "#2a3942");
  const borderColor = useColorModeValue("#e9edef", "#313d45");

  const SettingsItem = ({ icon, label, description, onClick }) => (
    <Box
      as="button"
      w="full"
      p={4}
      onClick={onClick}
      _hover={{ bg: hoverBg }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <HStack spacing={4} align="center">
        <Box fontSize="20px" color={textSecondary}>
          {icon}
        </Box>
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
        <FaChevronRight color={textSecondary} size={14} />
      </HStack>
    </Box>
  );

  return (
    <Flex h="100vh" bg={bgColor}>
      {/* Settings Panel */}
      <Box w="500px" bg={panelBg} borderRight="1px solid" borderColor={borderColor}>
        {/* Header */}
        <Box bg={headerBg} p={4}>
          <HStack spacing={4}>
            <IconButton
              icon={<FaArrowLeft />}
              variant="ghost"
              color="white"
              onClick={() => navigate("/dashboard")}
              _hover={{ bg: "whiteAlpha.200" }}
            />
            <Text color="white" fontSize="20px" fontWeight="500">
              Preferences
            </Text>
          </HStack>
        </Box>

        {/* Profile Section */}
        <Box
          p={4}
          _hover={{ bg: hoverBg }}
          cursor="pointer"
          onClick={() => navigate("/profile")}
        >
          <HStack spacing={4}>
            <Avatar
              size="lg"
              src={user?.profilePic}
              name={user?.name}
            />
            <VStack align="start" spacing={0} flex={1}>
              <Text color={textPrimary} fontSize="17px" fontWeight="500">
                {user?.name || "Your Name"}
              </Text>
              <Text color={textSecondary} fontSize="14px">
                {user?.status || "Learning and growing every day!"}
              </Text>
            </VStack>
            <FaChevronRight color={textSecondary} size={14} />
          </HStack>
        </Box>

        <Divider borderColor={borderColor} />

        {/* Settings Options */}
        <VStack spacing={0} align="stretch">
          <SettingsItem
            icon={<FaComments />}
            label="Conversations"
            description="Display, appearance, message options"
            onClick={() => navigate("/settings/chats")}
          />
          
          <SettingsItem
            icon={<FaBell />}
            label="Alerts"
            description="Sound, badges, notification settings"
          />
          
          <SettingsItem
            icon={<FaLock />}
            label="Security"
            description="Blocked users, data protection"
          />
          
          <SettingsItem
            icon={<FaKey />}
            label="Account Info"
            description="Profile details, login settings"
          />
          
          <SettingsItem
            icon={<FaInfoCircle />}
            label="Data & Storage"
            description="Usage stats, file management"
          />
          
          <SettingsItem
            icon={<FaQuestionCircle />}
            label="Support"
            description="FAQ, contact support, feedback"
          />
        </VStack>
      </Box>

      {/* Right Empty Panel */}
      <Flex flex={1} align="center" justify="center" bg={bgColor}>
        <VStack spacing={4}>
          <Box fontSize="60px">⚙️</Box>
          <Text color={textSecondary} fontSize="32px" fontWeight="300">
            Preferences
          </Text>
          <Text color={textSecondary} fontSize="14px" textAlign="center" maxW="400px">
            Customize your SkillChat experience
          </Text>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default Settings;
