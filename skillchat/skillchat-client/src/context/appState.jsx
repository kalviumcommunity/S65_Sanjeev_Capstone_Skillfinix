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

  // Optimized parallel data fetching
  const fetchDataParallel = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      // Make both API calls in parallel instead of sequential
      const [userResponse, conversationResponse] = await Promise.all([
        fetch(`${hostName}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          credentials: "include"
        }),
        fetch(`${hostName}/conversation/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          credentials: "include"
        })
      ]);

      // Handle user response
      if (userResponse.ok) {
        const userData = await userResponse.json();
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);

        // Setup socket with user ID
        if (userData._id) {
          socket.emit("setup", userData._id);
        }
      } else {
        throw new Error(`Failed to fetch user: ${userResponse.status}`);
      }

      // Handle conversation response
      if (conversationResponse.ok) {
        const conversationData = await conversationResponse.json();
        setMyChatList(conversationData);
        setOriginalChatList(conversationData);
      } else {
        if (conversationResponse.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          setUser({});
          throw new Error("Authentication token expired. Please login again.");
        }
        throw new Error("Failed to fetch conversations");
      }

    } catch (error) {
      console.error("Error fetching data:", error.message);
      setIsAuthenticated(false);
      setUser({});
      setMyChatList([]);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
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

  // Initial data fetching - now parallel and faster
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchDataParallel();
    } else {
      setIsLoading(false);
      setIsAuthenticated(false);
    }

    // Cleanup function for socket
    return () => {
      socket.off("setup");
      socket.off("receiver-online");
      socket.off("receiver-offline");
    };
  }, [fetchDataParallel]);

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
        hostName,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        receiver,
        setReceiver,
        messageList,
        setMessageList,
        activeChatId,
        setActiveChatId,
        myChatList,
        setMyChatList,
        originalChatList,
        setOriginalChatList,
        isOtherUserTyping,
        setIsOtherUserTyping,
        isChatLoading,
        setIsChatLoading,
        isLoading,
        setIsLoading,
        socket,
      }}
    >
      {props.children}
    </chatContext.Provider>
  );
};

export default ChatState;
