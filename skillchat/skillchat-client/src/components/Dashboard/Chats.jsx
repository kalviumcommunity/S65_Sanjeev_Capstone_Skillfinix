import React from "react";
import { Box } from "@chakra-ui/react";
import MyChatList from "./MyChatList";
import NewChats from "./NewChats";

const Chats = ({ searchQuery, activeTab, setActiveTab }) => {
  return (
    <Box height="100%" position="relative">
      {activeTab === 0 && (
        <MyChatList setactiveTab={setActiveTab} searchQuery={searchQuery} />
      )}
      
      {activeTab === 1 && (
        <NewChats setactiveTab={setActiveTab} />
      )}
    </Box>
  );
};

export default Chats;