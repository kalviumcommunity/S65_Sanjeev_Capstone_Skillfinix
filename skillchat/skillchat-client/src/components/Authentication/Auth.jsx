import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "./Login";
import Signup from "./Signup";
import React from "react";

const Auth = ({ tabindex, onClose }) => {
  const [activeTab, setActiveTab] = React.useState(tabindex);

  const handleTabsChange = (index) => {
    setActiveTab(index);
  };

  return (
    <Tabs isFitted variant="enclosed" index={activeTab} colorScheme="purple">
      <TabList mb="2em">
        <Tab onClick={() => handleTabsChange(0)}>Login</Tab>
        <Tab onClick={() => handleTabsChange(1)}>Sign Up</Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={0}>
          <Login handleTabsChange={handleTabsChange} onClose={onClose} />
        </TabPanel>
        <TabPanel>
          <Signup handleTabsChange={handleTabsChange} onClose={onClose} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Auth;