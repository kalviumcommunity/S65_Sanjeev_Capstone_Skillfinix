import { useState } from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, Container } from "@chakra-ui/react";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";

const App = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  return (
    <Container maxW="container.md" centerContent py={8}>
      <Box 
        w="full" 
        p={4} 
        borderRadius="lg" 
        boxShadow="md" 
        bg="white"
      >
        <Tabs isFitted variant="soft-rounded" colorScheme="purple" index={tabIndex} onChange={handleTabsChange}>
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login handleTabsChange={handleTabsChange} />
            </TabPanel>
            <TabPanel>
              <Signup handleTabsChange={handleTabsChange} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default App;