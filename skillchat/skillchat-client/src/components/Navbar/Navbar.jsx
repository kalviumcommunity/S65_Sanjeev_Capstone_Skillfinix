import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  useDisclosure,
  Avatar,
  IconButton,
  VStack,
  Tooltip,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaMoon,
  FaSun,
  FaComments,
  FaCog,
  FaArchive,
  FaUserFriends,
  FaUsers,
  FaArrowLeft,
} from "react-icons/fa";
import ProfileMenu from "../Profile/ProfileMenu";
import chatContext from "../../context/chatContext";
import { useNavigate } from "react-router-dom";
import { Home } from "react-feather";

const Sidebar = (props) => {
  const context = useContext(chatContext);
  const {
    isAuthenticated,
    user,
    activeChatId,
    setActiveChatId,
    setMessageList,
    setReceiver,
    socket,
  } = context;
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [colorMode, setColorMode] = useState(
    localStorage.getItem("chakra-ui-color-mode") || "light"
  );
  const navigate = useNavigate();

  // 🎯 PERFECT WHATSAPP SIDEBAR COLORS + INDIGO FOR CHAT
  const bgColorDefault = useColorModeValue("#f0f2f5", "#202c33");
  const iconColorDefault = useColorModeValue("#54656f", "#aebac1");
  const hoverBgDefault = useColorModeValue("#e5e7eb", "#2a3942");
  
  // 🔵 SPECIAL INDIGO-600 FOR CHAT ICON ONLY
  const chatActiveBg = useColorModeValue("#4f46e5", "#4f46e5"); // INDIGO-600 for both modes
  
  const otherActiveBg = useColorModeValue("#4f46e5", "#4f46e5"); // INDIGO-600
  
  const borderColor = useColorModeValue("#e9edef", "#313d45");

  // Use props if provided, otherwise use defaults
  const bgColor = props.sidebarBgColor || bgColorDefault;
  const iconColor = props.sidebarIconColor || iconColorDefault;
  const hoverBg = props.sidebarHover || hoverBgDefault;

  useEffect(() => {
    const storedColorMode = localStorage.getItem("chakra-ui-color-mode");
    setColorMode(storedColorMode || "light");
  }, []);

  const path = window.location.pathname;
  const activeRoute = path.split("/")[1] || "dashboard";

  const handleToggle = () => {
    const newColorMode = colorMode === "dark" ? "light" : "dark";
    setColorMode(newColorMode);
    if (props.toggleColorMode) {
      props.toggleColorMode();
    }
  };

  const isActive = (route) => {
    return activeRoute === route;
  };

  const iconData = {
    icon: (
      <Box position="relative" w="32px" h="32px">
        <Home size={32} />
        <FaArrowLeft
          size={12}
          style={{
            position: "absolute",
            bottom: "0",
            right: "-8px",
            transform: "translate(0%, 50%)",
          }}
        />
      </Box>
    ),
    label: "Go Back to Home",
    path: "http://localhost:2812",
  };

  return (
    <Box
      w="72px"
      h="100vh"
      bg={bgColor}
      display="flex"
      flexDirection="column"
      alignItems="center"
      py={4}
      position="fixed"
      left={0}
      top={0}
      zIndex={1000}
      borderRightWidth="1px"
      borderColor={borderColor}
      boxShadow="md"
    >
      {/* Top Section */}
      <VStack pt={2} pb={4} spacing={4}>
        <Tooltip label={iconData.label} placement="right" hasArrow>
          <IconButton
            aria-label={iconData.label}
            icon={iconData.icon}
            size="lg"
            variant="ghost"
            fontSize="xl"
            onClick={() => (window.location.href = iconData.path)}
            _hover={{ bg: hoverBg }}
            bg="transparent"
            borderRadius="full"
            color={iconColor}
          />
        </Tooltip>

        {/* 🔵 CHAT ICON - SPECIAL INDIGO-600 COLOR */}
        <Tooltip label="Chats" placement="right" hasArrow>
          <IconButton
            aria-label="Chats"
            icon={<FaComments />}
            size="lg"
            variant="ghost"
            fontSize="xl"
            onClick={() => navigate("/dashboard")}
            _hover={{ bg: hoverBg }}
            bg={isActive("dashboard") ? chatActiveBg : "transparent"}
            color={isActive("dashboard") ? "white" : iconColor}
            borderRadius="full"
          />
        </Tooltip>

        <Tooltip label="SkillSnaps" placement="right" hasArrow>
          <IconButton
            aria-label="SkillSnaps"
            icon={<FaArchive />}
            size="lg"
            variant="ghost"
            fontSize="xl"
            _hover={{ bg: hoverBg }}
            borderRadius="full"
            color={iconColor}
          />
        </Tooltip>

        <Tooltip label="SkillMeet" placement="right" hasArrow>
          <IconButton
            aria-label="SkillMeet"
            icon={<FaUsers />}
            size="lg"
            variant="ghost"
            fontSize="xl"
            onClick={() => navigate("/Barters")}
            _hover={{ bg: hoverBg }}
            bg={isActive("Barters") ? otherActiveBg : "transparent"}
            color={isActive("Barters") ? "white" : iconColor}
            borderRadius="full"
          />
        </Tooltip>

        <Tooltip label="SkillRooms" placement="right" hasArrow>
          <IconButton
            aria-label="SkillRooms"
            icon={<FaUserFriends />}
            size="lg"
            variant="ghost"
            fontSize="xl"
            _hover={{ bg: hoverBg }}
            borderRadius="full"
            color={iconColor}
          />
        </Tooltip>
      </VStack>

      <Spacer />

      {/* Bottom Section */}
      <VStack pb={4} spacing={4}>
        <Tooltip label="Settings" placement="right" hasArrow>
          <IconButton
            aria-label="Settings"
            icon={<FaCog />}
            size="lg"
            variant="ghost"
            fontSize="xl"
            onClick={() => navigate("/settings")}
            _hover={{ bg: hoverBg }}
            bg={isActive("settings") ? otherActiveBg : "transparent"}
            color={isActive("settings") ? "white" : iconColor}
            borderRadius="full"
          />
        </Tooltip>

        

        {isAuthenticated && user && (
          <Tooltip label="Your Profile" placement="right" hasArrow>
            <Avatar
              size="md"
              name={user?.name || "User"}
              src={user?.profilePic}
              cursor="pointer"
              onClick={onOpen}
              border="2px solid"
              borderColor={borderColor}
              _hover={{
                transform: "scale(1.05)",
                transition: "transform 0.2s",
              }}
            />
          </Tooltip>
        )}
      </VStack>

      {isAuthenticated && (
        <ProfileMenu
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          colorMode={colorMode}
          user={user}
        />
      )}
    </Box>
  );
};

export default Sidebar;
