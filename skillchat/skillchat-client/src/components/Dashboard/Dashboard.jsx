import React, { useEffect, useContext, useState } from "react";
import {
  Box,
  Divider,
  Flex,
  useToast,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  IconButton,
  Tooltip,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import chatContext from "../../context/chatContext";
import { AddIcon, SearchIcon, SettingsIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { FaEllipsisV, FaUsers, FaArchive, FaLock, FaBold } from "react-icons/fa";

const Dashboard = () => {
  const context = useContext(chatContext);
  const { user, setUser, isAuthenticated, activeChatId } = context;
  const navigator = useNavigate();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // Chat filter tabs
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSectionTab, setChatSectionTab] = useState(0); // 0 for MyChatList, 1 for NewChats
  const [isSearchActive, setIsSearchActive] = useState(false);

  // WhatsApp-like color scheme
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const containerBgColor = useColorModeValue("white", "gray.800");
  const searchBgColor = useColorModeValue("gray.100", "gray.700");

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
      // Ensure user data is loaded
      if (!user || Object.keys(user).length === 0) {
        // Try to load from localStorage if available
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

    return () => {};
  }, [isAuthenticated, user, setUser, navigator, toast]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        navigator("/");
      } else {
        // Only set isLoading to false if we have user data
        if (user && Object.keys(user).length > 0) {
          setIsLoading(false);
        } else {
          // Try to get user data from localStorage as a fallback
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              setIsLoading(false);
            } catch (e) {
              console.error("Error parsing stored user data", e);
              setIsLoading(false); // Set loading to false even if parsing fails
            }
          } else {
            setIsLoading(false); // Set loading to false if no stored user
          }
        }
      }
    };

    const timer = setTimeout(checkAuth, 1000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, setUser, navigator]);

  useEffect(() => {
    // Automatically activate search when query is not empty
    if (searchQuery.length > 0 && !isSearchActive) {
      setIsSearchActive(true);
    }
  }, [searchQuery]);

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
    setSearchQuery(""); // Clear search when going back
  };

  return (
    <>
      {isLoading && (
        <>
          <Box
            display={"flex"}
            p={3}
            w="99%"
            h="85vh"
            borderRadius="lg"
            borderWidth="1px"
            m={"auto"}
            mt={2}
            ml={{ base: "72px", md: "72px" }}
          >
            <Box
              h={"80vh"}
              w={{
                base: "100%",
                md: "29vw",
              }}
              mt={10}
              mx={2}
            >
              <Divider mb={5} />
              <Stack>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton height="50px" key={i} borderRadius={"lg"} />
                ))}
              </Stack>
            </Box>

            <Box h={"80vh"} w={"75%"} display={{ base: "none", md: "block" }}>
              <Stack mt={5}>
                <SkeletonCircle size="10" mx={2} />

                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonText
                    key={i}
                    mt={4}
                    mx={2}
                    noOfLines={4}
                    spacing={4}
                    borderRadius={"lg"}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </>
      )}
      {!isLoading && (
        <Box
          p={{ base: 0, md: 0 }}
          ml={{ base: "72px", md: "72px" }}
          w={{ base: "calc(100% - 72px)", md: "calc(100% - 72px)" }}
          h={{ base: "100vh", md: "100vh" }}
          borderRadius="lg"
          minW={"min-content"}
          bg={bgColor}
        >
          <Flex h={"100%"}>
            {/* Chat List Panel */}
            <Box
              display={{
                base: activeChatId !== "" ? "none" : "flex",
                md: "flex",
              }}
              flexDirection="column"
              w={{ base: "100%", md: "30%" }}
              borderRightWidth="1px"
              bg={containerBgColor}
            >
              {/* Header - Always visible, regardless of search state */}
              <Flex
                justify="space-between"
                align="center"
                p={3}
                bg={containerBgColor}
              >
                <Text fontSize="xl" fontWeight="bold">
                  Chats
                </Text>
                <Flex>
                  <Tooltip label="New Chat">
                    <IconButton
                      icon={<AddIcon />}
                      variant="ghost"
                      borderRadius="full"
                      mr={2}
                      aria-label="New Chat"
                      onClick={() => setChatSectionTab(1)}
                    />
                  </Tooltip>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FaEllipsisV />}
                      variant="ghost"
                      borderRadius="full"
                      aria-label="Menu"
                    />
                    <MenuList>
                      <MenuItem icon={<FaArchive />}>Archived</MenuItem>
                      <MenuItem icon={<FaLock />}>Locked chats</MenuItem>
                      <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </Flex>
              
              {/* WhatsApp-Style Search */}
              <Box
                pt={1}
                p={2}
                pb={4}
                bg={containerBgColor}
                position="sticky"
                top="0"
                zIndex="1"
              >
                <InputGroup
                  size="md"
                  bg={searchBgColor}
                  borderRadius="lg"
                  overflow="hidden"
                  _focusWithin={{
                    boxShadow: "outline",
                  }}
                >
                  <InputLeftElement pointerEvents="none" height="100%" pl={3}>
                    {isSearchActive ? (
                      <ArrowBackIcon 
                        color="gray.500" 
                        boxSize={4} 
                        cursor="pointer"
                        onClick={handleBackClick}
                        pointerEvents="auto"
                      />
                    ) : (
                      <SearchIcon color="gray.500" boxSize={4} />
                    )}
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Search"
                    borderRadius="lg"
                    border="none"
                    _focus={{
                      boxShadow: "none",
                    }}
                    _placeholder={{
                      color: "gray.500",
                      fontSize: "sm",
                    }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    fontSize="sm"
                    pl={10}
                    py={2}
                  />
                </InputGroup>
              </Box>
              
              {/* Tabs - Always visible */}
              <Flex
                px={2}
                mb={2}
                overflowX="auto"
                css={{ scrollbarWidth: "none" }}
                bg={containerBgColor}
              >
                <Flex
                  justify="center"
                  align="center"
                  px={4}
                  py={1}
                  cursor="pointer"
                  borderRadius="full"
                  bg={activeTab === "all" ? "blue.500" : "transparent"}
                  color={activeTab === "all" ? "white" : "gray.600"}
                  _hover={{ bg: activeTab === "all" ? "blue.600" : "gray.100" }}
                  onClick={() => handleTabChange("all")}
                  mr={2}
                >
                  <Text fontSize="sm">All</Text>
                </Flex>
                <Flex
                  justify="center"
                  align="center"
                  px={4}
                  py={1}
                  cursor="pointer"
                  borderRadius="full"
                  bg={activeTab === "unread" ? "blue.500" : "transparent"}
                  color={activeTab === "unread" ? "white" : "gray.600"}
                  _hover={{
                    bg: activeTab === "unread" ? "blue.600" : "gray.100",
                  }}
                  onClick={() => handleTabChange("unread")}
                  mr={2}
                >
                  <Text fontSize="sm">Unread</Text>
                </Flex>
                <Flex
                  justify="center"
                  align="center"
                  px={4}
                  py={1}
                  cursor="pointer"
                  borderRadius="full"
                  bg={activeTab === "favorites" ? "blue.500" : "transparent"}
                  color={activeTab === "favorites" ? "white" : "gray.600"}
                  _hover={{
                    bg: activeTab === "favorites" ? "blue.600" : "gray.100",
                  }}
                  onClick={() => handleTabChange("favorites")}
                  mr={2}
                >
                  <Text fontSize="sm">HeartHub</Text>
                </Flex>
                <Flex
                  justify="center"
                  align="center"
                  px={4}
                  py={1}
                  cursor="pointer"
                  borderRadius="full"
                  bg={activeTab === "groups" ? "blue.500" : "transparent"}
                  color={activeTab === "groups" ? "white" : "gray.600"}
                  _hover={{
                    bg: activeTab === "groups" ? "blue.600" : "gray.100",
                  }}
                  onClick={() => handleTabChange("groups")}
                >
                  <Text fontSize="sm">Groups</Text>
                </Flex>
              </Flex>
              
              {/* Search Results Label - Show when search is active with query */}
              {isSearchActive && searchQuery.length > 0 && (
                <Box px={4} pt={2}>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    Search results for "{searchQuery}"
                  </Text>
                </Box>
              )}
              
              {/* Chat List */}
              <Box flex={1} overflowY="auto" bg={containerBgColor}>
                <Chats
                  searchQuery={searchQuery}
                  activeTab={chatSectionTab}
                  setActiveTab={setChatSectionTab}
                />
              </Box>
            </Box>

            {/* Chat Area */}
            <Box
              h={"inherit"}
              w={{
                base: "100%",
                md: "70%",
              }}
              minW={"min-content"}
              bg={containerBgColor}
            >
              <ChatArea />
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default Dashboard;