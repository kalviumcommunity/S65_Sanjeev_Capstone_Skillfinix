import React, { useState, useEffect, useRef } from "react";
import { 
  Box, 
  Input,
  Text,
  Grid,
  GridItem,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  InputGroup,
  InputLeftElement,
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import { FaSearch, FaClock } from "react-icons/fa";
import { emojiCategories, recentEmojis, searchEmojis } from "./emojiData";

const EmojiPicker = ({ onSelectEmoji, onClose, isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const tabPanelRef = useRef(null);
  
  // WhatsApp theme colors
  const bgColor = useColorModeValue("white", "#1F2C34");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const placeholderColor = useColorModeValue("gray.500", "gray.400");
  const searchBgColor = useColorModeValue("gray.100", "#131C21");
  const borderColor = useColorModeValue("gray.200", "#2D3B43");
  const hoverBgColor = useColorModeValue("gray.100", "#2D3B43");
  const scrollThumbColor = useColorModeValue("#CBD5E0", "#2D3B43");
  const categoryLabelColor = useColorModeValue("gray.500", "gray.400");
  const activeTabColor = useColorModeValue("teal.500", "#00A884");
  
  useEffect(() => {
    if (searchQuery) {
      const results = searchEmojis(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleEmojiClick = (emoji) => {
    onSelectEmoji(emoji);
    // In a full implementation, you'd also add this emoji to the recent emojis array
  };

  return (
    <Box 
      bg={bgColor}
      borderRadius="lg"
      boxShadow="xl"
      maxHeight="350px"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      width="100%"
      border="1px solid"
      borderColor={borderColor}
    >
      {/* Search bar for emojis */}
      <Box p={2} borderBottom="1px solid" borderColor={borderColor}>
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none" color={placeholderColor}>
            <FaSearch />
          </InputLeftElement>
          <Input 
            placeholder="Search emoji"
            borderRadius="full"
            bg={searchBgColor}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            color={textColor}
            _placeholder={{
              color: placeholderColor
            }}
            _focus={{
              boxShadow: "none",
              borderColor: activeTabColor,
            }}
          />
        </InputGroup>
      </Box>
      
      {searchQuery ? (
        // Search Results
        <Box 
          overflowY="auto" 
          height="270px"
          css={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
              background: "transparent"
            },
            "&::-webkit-scrollbar-thumb": {
              background: scrollThumbColor,
              borderRadius: "24px",
            },
          }}
          p={2}
        >
          <Text fontSize="sm" fontWeight="medium" color={categoryLabelColor} mb={2}>
            Search Results
          </Text>
          
          {searchResults.length > 0 ? (
            <Grid templateColumns="repeat(8, 1fr)" gap={1}>
              {searchResults.map((emoji, index) => (
                <GridItem key={index}>
                  <Box 
                    fontSize="24px" 
                    cursor="pointer" 
                    textAlign="center"
                    borderRadius="md"
                    _hover={{ bg: hoverBgColor }}
                    onClick={() => handleEmojiClick(emoji)}
                    p={1}
                  >
                    {emoji}
                  </Box>
                </GridItem>
              ))}
            </Grid>
          ) : (
            <Text textAlign="center" color={categoryLabelColor} fontSize="sm" mt={4}>
              No emojis found
            </Text>
          )}
        </Box>
      ) : (
        // Tabs for emoji categories - WhatsApp style
        <Tabs 
          colorScheme="teal" 
          size="sm" 
          onChange={setActiveTab} 
          index={activeTab}
          isLazy
          variant="unstyled"
        >
          <Flex 
            position="sticky" 
            top="0" 
            bg={bgColor} 
            zIndex="1" 
            borderBottom="1px solid" 
            borderColor={borderColor}
          >
            <TabList 
              overflowX="auto" 
              py={1}
              width="100%"
              justifyContent="space-between"
              px={2}
              css={{
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none"
                }
              }}
            >
              <Tab 
                px={1.5} 
                py={1} 
                minW="auto" 
                _selected={{ color: activeTabColor, borderBottom: `2px solid ${activeTabColor}` }}
                fontSize="xl"
              >
                <FaClock />
              </Tab>
              {emojiCategories.map((category, index) => (
                <Tab 
                  key={index} 
                  px={1.5} 
                  py={1} 
                  minW="auto"
                  _selected={{ color: activeTabColor, borderBottom: `2px solid ${activeTabColor}` }}
                  fontSize="xl"
                >
                  {category.icon}
                </Tab>
              ))}
            </TabList>
          </Flex>
          
          <TabPanels>
            {/* Recent Emojis Tab */}
            <TabPanel p={2} ref={tabPanelRef}>
              <Box
                height="260px"
                overflowY="auto"
                css={{
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    width: "6px",
                    background: "transparent"
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: scrollThumbColor,
                    borderRadius: "24px",
                  },
                }}
              >
                <Text fontSize="sm" fontWeight="medium" color={categoryLabelColor} mb={2}>
                  Recently Used
                </Text>
                <Grid templateColumns="repeat(8, 1fr)" gap={1}>
                  {recentEmojis.map((emoji, index) => (
                    <GridItem key={index}>
                      <Box 
                        fontSize="24px" 
                        cursor="pointer" 
                        textAlign="center"
                        borderRadius="md"
                        _hover={{ bg: hoverBgColor }}
                        onClick={() => handleEmojiClick(emoji)}
                        p={1}
                      >
                        {emoji}
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </TabPanel>
            
            {/* Category Tabs */}
            {emojiCategories.map((category, index) => (
              <TabPanel key={index} p={2}>
                <Box
                  height="260px"
                  overflowY="auto"
                  css={{
                    "&::-webkit-scrollbar": {
                      width: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      width: "6px",
                      background: "transparent"
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: scrollThumbColor,
                      borderRadius: "24px",
                    },
                  }}
                >
                  <Text fontSize="sm" fontWeight="medium" color={categoryLabelColor} mb={2}>
                    {category.name}
                  </Text>
                  <Grid templateColumns="repeat(8, 1fr)" gap={1}>
                    {category.emojis.map((emoji, emojiIndex) => (
                      <GridItem key={emojiIndex}>
                        <Box 
                          fontSize="24px" 
                          cursor="pointer" 
                          textAlign="center"
                          borderRadius="md"
                          _hover={{ bg: hoverBgColor }}
                          onClick={() => handleEmojiClick(emoji)}
                          p={1}
                        >
                          {emoji}
                        </Box>
                      </GridItem>
                    ))}
                  </Grid>
                </Box>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default EmojiPicker;