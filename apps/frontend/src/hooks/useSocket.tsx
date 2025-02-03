import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

const WebSocketContext = createContext<WebSocket | null>(null);

export const useSocket = (token: string | null) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const isMounted = useRef(true);

  const connect = useCallback(() => {
    if (!token) return;

    const WS_URL = `ws://localhost:8080/?token=${token}`;
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connected");
      reconnectAttempts.current = 0;
      if (isMounted.current) setSocket(ws);
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected", event.reason);
      if (isMounted.current) setSocket(null);

      // Exponential backoff reconnect
      if (event.code !== 1000) {
        // Don't reconnect if closed normally
        const timeout = Math.min(
          1000 * Math.pow(2, reconnectAttempts.current),
          30000
        );
        setTimeout(() => {
          if (isMounted.current && token) connect();
        }, timeout);
        reconnectAttempts.current += 1;
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return ws;
  }, [token]);

  useEffect(() => {
    isMounted.current = true;
    const ws = connect();

    return () => {
      isMounted.current = false;
      reconnectAttempts.current = 0;
      if (ws?.readyState === WebSocket.OPEN) {
        ws.close(1000, "Component unmounted");
      }
    };
  }, [connect]);

  return socket;
};

export const WebSocketProvider: React.FC<{
  token: string | null;
  children: ReactNode;
}> = ({ token: initialToken, children }) => {
  const [authToken, setAuthToken] = useState(initialToken);

  // Handle token updates from localStorage
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("Token");
    if (tokenFromStorage !== authToken) {
      setAuthToken(tokenFromStorage);
    }
  }, [authToken]);

  if (!authToken) {
    return <>{children}</>; // Render children without WebSocket
  }

  const socket = useSocket(authToken);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
