import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Flex,
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
import ProfileMenu from "./ProfileMenu";
import chatContext from "../../context/chatContext";
import { useNavigate } from "react-router-dom";

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

  // Instagram-like blue color scheme
  const bgColor = useColorModeValue("blue.600", "gray.900");
  const hoverBgColor = useColorModeValue("blue.500", "gray.800");
  const activeBgColor = useColorModeValue("blue.500", "gray.700");
  const borderColor = useColorModeValue("blue.400", "gray.700");

  useEffect(() => {
    const storedColorMode = localStorage.getItem("chakra-ui-color-mode");
    setColorMode(storedColorMode || "light");
  }, []);

  const path = window.location.pathname;
  const activeRoute = path.split("/")[1] || "dashboard";

  const handleToggle = () => {
    const newColorMode = colorMode === "dark" ? "light" : "dark";
    setColorMode(newColorMode);
    props.toggleColorMode();
  };

  const isActive = (route) => {
    return activeRoute === route ? true : false;
  };

  const handleBack = () => {
    socket.emit("leave-chat", activeChatId);
    setActiveChatId("");
    setMessageList([]);
    setReceiver({});
  };

  // Show back button on mobile when in chat
  const showBackButton = activeChatId !== "" && window.innerWidth < 768;

  return (
    <Box
      bg={bgColor}
      color="white"
      h="100vh"
      w={{ base: showBackButton ? "0" : "72px", md: "72px" }}
      position="fixed"
      left={0}
      top={0}
      zIndex={1}
      display={{ base: showBackButton ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      boxShadow="md"
    >
      {/* Top Section */}
      <VStack pt={6} pb={4} spacing={6}>
        <Tooltip label="Chats" placement="right">
          <IconButton
            aria-label="Chats"
            icon={<FaComments />}
            size="lg"
            variant="ghost"
            fontSize="xl"
            isActive={isActive("dashboard")}
            onClick={() => navigate("/dashboard")}
            _hover={{ bg: hoverBgColor }}
            bg={isActive("dashboard") ? activeBgColor : "transparent"}
            borderRadius="full"
          />
        </Tooltip>

        <Tooltip label="SkillSnaps" placement="right">
          <IconButton
            aria-label="SkillSnaps"
            icon={<FaArchive />}
            size="lg"
            variant="ghost"
            fontSize="xl"
            _hover={{ bg: hoverBgColor }}
            borderRadius="full"
          />
        </Tooltip>

        <Tooltip label="SkillMeet" placement="right">
          <IconButton
            aria-label="SkillMeet"
            icon={<FaUsers />}
            size="lg"
            variant="ghost"
            fontSize="xl"
            isActive={isActive("Barters")}
            onClick={() => navigate("/Barters")}
            _hover={{ bg: hoverBgColor }}
            bg={isActive("Barters") ? activeBgColor : "transparent"}
            borderRadius="full"
          />
        </Tooltip>

        <Tooltip label="SkillRooms" placement="right">
          <IconButton
            aria-label="SkillRooms"
            icon={<FaUserFriends />}
            size="lg"
            variant="ghost"
            fontSize="xl"
            _hover={{ bg: hoverBgColor }}
            borderRadius="full"
          />
        </Tooltip>
      </VStack>

      <Spacer />

      {/* Bottom Section with User Profile - WhatsApp style */}
      <VStack pb={6} spacing={6}>
        <Tooltip label="Settings" placement="right">
          <IconButton
            aria-label="Settings"
            icon={<FaCog />}
            size="lg"
            variant="ghost"
            fontSize="xl"
            isActive={isActive("settings")}
            onClick={() => navigate("/settings")}
            _hover={{ bg: hoverBgColor }}
            bg={isActive("settings") ? activeBgColor : "transparent"}
            borderRadius="full"
          />
        </Tooltip>

        <Tooltip
          label={colorMode === "dark" ? "Light Mode" : "Dark Mode"}
          placement="right"
        >
          <IconButton
            aria-label="Toggle Color Mode"
            icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
            onClick={handleToggle}
            size="lg"
            variant="ghost"
            fontSize="xl"
            _hover={{ bg: hoverBgColor }}
            borderRadius="full"
          />
        </Tooltip>

        <Tooltip label="Your Profile" placement="right">
          <Avatar
            size="md"
            name={user?.name || "User"}
            src={user?.profilePic}
            cursor="pointer"
            onClick={onOpen}
            border="2px solid"
            borderColor={borderColor}
          />
        </Tooltip>
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