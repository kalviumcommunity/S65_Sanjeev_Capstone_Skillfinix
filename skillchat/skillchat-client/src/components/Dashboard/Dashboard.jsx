import React, { useEffect, useContext, useState } from "react";
import {
  Box,
  Flex,
  useToast,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  IconButton,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import chatContext from "../../context/chatContext";
import {
  AddIcon,
  SearchIcon,
  SettingsIcon,
  ArrowBackIcon,
} from "@chakra-ui/icons";
import { FaEllipsisV, FaArchive, FaLock } from "react-icons/fa";

// Import components for functionality
import MyChatList from "./MyChatList";
import NewChats from "./NewChats";
import ChatArea from "./ChatArea";
import Sidebar from "../Navbar/Navbar";

const Dashboard = () => {
  const context = useContext(chatContext);
  const { user, setUser, isAuthenticated, activeChatId } = context;
  const navigator = useNavigate();
  const toast = useToast();
  const { toggleColorMode } = useColorMode();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSectionTab, setChatSectionTab] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // 🎯 PERFECT WHATSAPP WEB COLORS - EXACT MATCH
  // Main backgrounds
  const bgColor = useColorModeValue("#f0f2f5", "#0b141a"); // Main background
  const containerBgColor = useColorModeValue("#ffffff", "#0b141a"); // Chat area

  // Panels and headers - NO BLUE ANYWHERE!
  const headerBgColor = useColorModeValue("#ffffff", "#202c33"); // Header panels
  const sidebarBgColor = useColorModeValue("#f0f2f5", "#202c33"); // Sidebar

  // Search areas
  const searchBgColor = useColorModeValue("#f0f2f5", "#2a3942"); // Search background
  const searchFocusBg = useColorModeValue("#ffffff", "#2a3942"); // Focused search

  // Text colors with perfect contrast
  const primaryTextColor = useColorModeValue("#111b21", "#e9edef"); // Primary text
  const secondaryTextColor = useColorModeValue("#667781", "#8696a0"); // Secondary text

  // Borders and dividers
  const borderColor = useColorModeValue("#e9edef", "#313d45"); // All borders

  // 🔵 SIDEBAR COLORS - INDIGO FOR CHAT ICON
  const sidebarIconColor = useColorModeValue("#54656f", "#aebac1"); // Icons
  const sidebarHover = useColorModeValue("#e5e7eb", "#2a3942"); // Hover states
  
  // 🔵 PERFECT TRANSPARENT TAB COLORS - INDIGO ACTIVE, TRANSPARENT INACTIVE
  const tabActiveBg = "#4f46e5"; // INDIGO-600 for active tab ONLY
  const tabActiveColor = "white"; // White text on active
  const tabInactiveColor = secondaryTextColor; // Gray text on inactive
  const tabHoverBg = useColorModeValue(
    "rgba(79, 70, 229, 0.08)", // Light indigo hover in light mode
    "rgba(79, 70, 229, 0.12)"  // Slightly stronger in dark mode
  );
  const tabInactiveBg = "transparent"; // FULLY TRANSPARENT inactive tabs
  const tabInactiveBorder = useColorModeValue("#e0e2e5", "#3e4a52"); // Subtle borders

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "You are not logged in",
        description: "Please login to continue",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigator("/");
    } else {
      if (!user || Object.keys(user).length === 0) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error("Error parsing stored user data", e);
          }
        }
      }
    }
  }, [isAuthenticated, user, setUser, navigator, toast]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        navigator("/");
      } else {
        if (user && Object.keys(user).length > 0) {
          setIsLoading(false);
        } else {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              setIsLoading(false);
            } catch (e) {
              console.error("Error parsing stored user data", e);
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
          }
        }
      }
    };
    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, setUser, navigator]);

  useEffect(() => {
    if (searchQuery.length > 0 && !isSearchActive) {
      setIsSearchActive(true);
    }
  }, [searchQuery, isSearchActive]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleBackClick = () => {
    setIsSearchActive(false);
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <Box h="100vh" bg={bgColor} display="flex">
        {/* Sidebar Skeleton */}
        <Box
          w="72px"
          h="100%"
          bg={sidebarBgColor}
          flexShrink={0}
          borderRightWidth="1px"
          borderColor={borderColor}
        >
          <Stack spacing={4} align="center" p={2}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCircle
                key={i}
                size="12"
                startColor={sidebarHover}
                endColor={borderColor}
              />
            ))}
          </Stack>
        </Box>

        {/* Chat List Skeleton */}
        <Box
          w="380px"
          h="100%"
          bg={headerBgColor}
          borderRightWidth="1px"
          borderColor={borderColor}
          p={4}
          flexShrink={0}
        >
          <Skeleton
            height="60px"
            mb={4}
            borderRadius="lg"
            startColor={borderColor}
            endColor={sidebarHover}
          />
          <Skeleton
            height="50px"
            mb={4}
            borderRadius="lg"
            startColor={borderColor}
            endColor={sidebarHover}
          />
          <Stack spacing={3}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Flex key={i} align="center" p={3}>
                <SkeletonCircle
                  size="12"
                  mr={4}
                  startColor={borderColor}
                  endColor={sidebarHover}
                />
                <Box flex={1}>
                  <Skeleton
                    height="18px"
                    mb={2}
                    startColor={borderColor}
                    endColor={sidebarHover}
                  />
                  <Skeleton
                    height="14px"
                    width="70%"
                    startColor={borderColor}
                    endColor={sidebarHover}
                  />
                </Box>
              </Flex>
            ))}
          </Stack>
        </Box>

        {/* Chat Area Skeleton */}
        <Box flex={1} h="100%" bg={containerBgColor} p={6}>
          <Stack spacing={6}>
            <SkeletonCircle
              size="16"
              alignSelf="center"
              startColor={borderColor}
              endColor={sidebarHover}
            />
            <Stack spacing={4}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonText
                  key={i}
                  noOfLines={2}
                  spacing="3"
                  startColor={borderColor}
                  endColor={sidebarHover}
                />
              ))}
            </Stack>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box h="100vh" bg={bgColor} overflow="hidden">
      <Flex h="100%">
        {/* 🔵 SIDEBAR - INDIGO CHAT ICON */}
        <Box
          position="fixed"
          left="0"
          top="0"
          h="100vh"
          w="72px"
          zIndex="1000"
          bg={sidebarBgColor}
          borderRightWidth="1px"
          borderColor={borderColor}
        >
          <Sidebar
            toggleColorMode={toggleColorMode}
            sidebarBgColor={sidebarBgColor}
            sidebarIconColor={sidebarIconColor}
            sidebarHover={sidebarHover}
          />
        </Box>

        {/* MAIN DASHBOARD CONTENT */}
        <Box ml="72px" flex={1} h="100%" display="flex">
          {/* 📱 CHAT LIST PANEL - Perfect WhatsApp Web Match */}
          <Box
            display={{
              base: activeChatId !== "" ? "none" : "flex",
              md: "flex",
            }}
            flexDirection="column"
            w={{ base: "100%", md: "380px" }}
            h="100%"
            bg={headerBgColor}
            borderRightWidth="1px"
            borderColor={borderColor}
            flexShrink={0}
          >
            {/* CHAT HEADER - Exact WhatsApp match */}
            <Flex
              align="center"
              justify="space-between"
              px={4}
              py={3}
              h="70px"
              bg={headerBgColor}
              borderBottomWidth="1px"
              borderColor={borderColor}
            >
              <Text fontSize="xl" fontWeight="600" color={primaryTextColor}>
                Chats
              </Text>
              <Flex gap={1}>
                <Tooltip label="New Chat" placement="bottom" hasArrow>
                  <IconButton
                    icon={<AddIcon />}
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    aria-label="New Chat"
                    onClick={() => setChatSectionTab(1)}
                    _hover={{ bg: tabHoverBg }}
                    color={secondaryTextColor}
                  />
                </Tooltip>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FaEllipsisV />}
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    aria-label="More options"
                    _hover={{ bg: tabHoverBg }}
                    color={secondaryTextColor}
                  />
                  <MenuList bg={headerBgColor} borderColor={borderColor}>
                    <MenuItem
                      icon={<FaArchive />}
                      _hover={{ bg: tabHoverBg }}
                      color={primaryTextColor}
                    >
                      Archived
                    </MenuItem>
                    <MenuItem
                      icon={<FaLock />}
                      _hover={{ bg: tabHoverBg }}
                      color={primaryTextColor}
                    >
                      Locked chats
                    </MenuItem>
                    <MenuItem
                      icon={<SettingsIcon />}
                      _hover={{ bg: tabHoverBg }}
                      color={primaryTextColor}
                    >
                      Settings
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>

            {/* SEARCH BAR - Exact WhatsApp style */}
            <Box px={4} py={3} bg={headerBgColor}>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none" height="40px">
                  {isSearchActive ? (
                    <ArrowBackIcon
                      color={secondaryTextColor}
                      boxSize={4}
                      cursor="pointer"
                      onClick={handleBackClick}
                      pointerEvents="auto"
                      _hover={{ color: primaryTextColor }}
                    />
                  ) : (
                    <SearchIcon color={secondaryTextColor} boxSize={4} />
                  )}
                </InputLeftElement>
                <Input
                  placeholder="Search or start new chat"
                  bg={searchBgColor}
                  border="none"
                  borderRadius="8px"
                  h="40px"
                  _focus={{
                    bg: searchFocusBg,
                    boxShadow: "none",
                  }}
                  _placeholder={{
                    color: secondaryTextColor,
                    fontSize: "14px",
                  }}
                  color={primaryTextColor}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  fontSize="14px"
                  pl="40px"
                />
              </InputGroup>
            </Box>

            {/* 🎯 PERFECT TRANSPARENT WHATSAPP FILTER TABS */}
            <Box px={4} pb={2} bg={headerBgColor}>
              <Flex
                gap={2}
                overflowX="auto"
                css={{
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {[
                  { key: "all", label: "All" },
                  { key: "unread", label: "Unread" },
                  { key: "favorites", label: "Favourites" },
                  { key: "groups", label: "Groups" },
                ].map((tab) => (
                  <Button
                    key={tab.key}
                    size="sm"
                    borderRadius="20px"
                    // 🎯 CONDITIONAL STYLING - ACTIVE VS INACTIVE
                    bg={activeTab === tab.key ? tabActiveBg : tabInactiveBg}
                    color={activeTab === tab.key ? tabActiveColor : tabInactiveColor}
                    _hover={{
                      bg: activeTab === tab.key ? "#3730a3" : tabHoverBg, // Darker indigo for active, light indigo for inactive
                    }}
                    onClick={() => handleTabChange(tab.key)}
                    px={4}
                    h="32px"
                    fontSize="13px"
                    fontWeight="500"
                    minW="fit-content"
                    // 🎯 BORDER LOGIC - ONLY INACTIVE TABS GET BORDER
                    border={activeTab === tab.key ? "none" : "1px solid"}
                    borderColor={activeTab === tab.key ? "transparent" : tabInactiveBorder}
                    transition="all 0.2s ease"
                    // 🎯 REMOVE CHAKRA DEFAULT STYLES
                    _active={{ 
                      bg: activeTab === tab.key ? tabActiveBg : tabInactiveBg,
                      transform: "none" 
                    }}
                    _focus={{ 
                      boxShadow: "none",
                      bg: activeTab === tab.key ? tabActiveBg : tabInactiveBg
                    }}
                    variant="ghost"
                  >
                    {tab.label}
                  </Button>
                ))}
              </Flex>
            </Box>

            {/* SEARCH RESULTS LABEL */}
            {isSearchActive && searchQuery.length > 0 && (
              <Box px={4} py={2} bg={headerBgColor}>
                <Text
                  fontSize="13px"
                  color={secondaryTextColor}
                  fontWeight="500"
                >
                  Search results for "{searchQuery}"
                </Text>
              </Box>
            )}

            {/* CHAT LIST CONTENT */}
            <Box flex={1} overflow="hidden" bg={headerBgColor}>
              {chatSectionTab === 0 ? (
                <MyChatList activeTab={activeTab} searchQuery={searchQuery} />
              ) : (
                <NewChats setactiveTab={setChatSectionTab} />
              )}
            </Box>
          </Box>

          {/* 💬 CHAT AREA PANEL - Perfect background */}
          <Box
            flex={1}
            h="100%"
            bg={containerBgColor}
            display={{
              base: activeChatId !== "" ? "flex" : "none",
              md: "flex",
            }}
          >
            <ChatArea />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Dashboard;
