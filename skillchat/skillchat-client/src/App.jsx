// App.js
import "./App.css";
import { useColorMode, ChakraProvider } from "@chakra-ui/react";
import Navbar from "./components/Navbar/Navbar";
import ChatState from "./context/appState";
import { useContext } from "react";
import chatContext from "./context/chatContext";
import { useLocation } from "react-router-dom";

function App(props) {
  const { toggleColorMode } = useColorMode();
  const context = useContext(chatContext);
  const location = useLocation();
  
  // Hide navbar on these routes
  const hideNavbarRoutes = ["/", "/login", "/signup"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <ChakraProvider>
      <ChatState>
        <div className="App">
          {shouldShowNavbar && <Navbar toggleColorMode={toggleColorMode} context={context} />}
        </div>
      </ChatState>
    </ChakraProvider>
  );
}

export default App;