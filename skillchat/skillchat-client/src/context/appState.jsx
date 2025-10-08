import chatContext from "./chatContext";
import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

const hostName = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Create socket instance outside component to prevent recreation
const socket = io(hostName, {
  withCredentials: true,
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: false 
});

const ChatState = (props) => {
  // Parse user from localStorage initially
  const storedUser = localStorage.getItem("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : {};

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [user, setUser] = useState(initialUser);
  const [receiver, setReceiver] = useState({});
  const [messageList, setMessageList] = useState([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [myChatList, setMyChatList] = useState([]);
  const [originalChatList, setOriginalChatList] = useState([]);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Create a memoized fetchData function to avoid recreating on each render
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch(`${hostName}/conversation/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        credentials: "include"  // Important for cross-origin requests with cookies
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          setUser({});
          throw new Error("Authentication token expired. Please login again.");
        }
        throw new Error("Failed to fetch data: " + (await response.text()));
      }
      
      const jsonData = await response.json();
      setMyChatList(jsonData);
      setOriginalChatList(jsonData);
    } catch (error) {
      console.error("Error fetching conversations:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch user data function
  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setUser({});
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${hostName}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        credentials: "include"
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch user: ${res.status}`);
      }

      const data = await res.json();
      
      // Store user data properly
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setIsAuthenticated(true);
      
      // Setup socket with user ID
      if (data._id) {
        socket.emit("setup", data._id);
      }
    } catch (error) {
      console.error("Error fetching user:", error.message);
      setIsAuthenticated(false);
      setUser({});
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);

  // Reconnect socket if token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      socket.io.opts.extraHeaders = {
        "auth-token": token
      };
      if (!socket.connected) {
        socket.connect();
      }
    } else {
      if (socket.connected) {
        socket.disconnect();
      }
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    // Clean up existing listeners before adding new ones
    socket.off("receiver-online");
    socket.on("receiver-online", () => {
      setReceiver((prevReceiver) => ({ ...prevReceiver, isOnline: true }));
    });

    return () => {
      socket.off("receiver-online");
    };
  }, [receiver._id]);

  useEffect(() => {
    socket.off("receiver-offline");
    socket.on("receiver-offline", () => {
      setReceiver((prevReceiver) => ({
        ...prevReceiver,
        isOnline: false,
        lastSeen: new Date().toISOString(),
      }));
    });

    return () => {
      socket.off("receiver-offline");
    };
  }, [receiver._id]);

  // Initial data fetching
  useEffect(() => {
    // Always fetch user first, then fetch chats
    const initializeApp = async () => {
      await fetchUser();
      await fetchData();
    };
    
    initializeApp();
    
    // Cleanup function for socket
    return () => {
      socket.off("setup");
      socket.off("receiver-online");
      socket.off("receiver-offline");
    };
  }, [fetchUser, fetchData]);

  // Handle socket connection errors
  useEffect(() => {
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    return () => {
      socket.off("connect_error");
      socket.off("error");
    };
  }, []);

  return (
    <chatContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        receiver,
        setReceiver,
        messageList,
        setMessageList,
        activeChatId,
        setActiveChatId,
        myChatList,
        setMyChatList,
        originalChatList,
        fetchData,
        hostName,
        socket,
        isOtherUserTyping,
        setIsOtherUserTyping,
        isChatLoading,
        setIsChatLoading,
        isLoading,
        setIsLoading,
      }}
    >
      {props.children}
    </chatContext.Provider>
  );
};

export default ChatState;