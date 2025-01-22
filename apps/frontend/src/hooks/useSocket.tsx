
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const WebSocketContext = createContext<WebSocket | null>(null);

export const useSocket = (token: string) => {
  const WS_URL = `ws://localhost:8080/?token=${token}`;
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
        ws.close();
    };
  }, [token]);

  return socket;
};

export const WebSocketProvider: React.FC<{
  token: string | null;
  children: ReactNode;
}> = ({ token, children }) => {
  if (!token) {
    token = localStorage.getItem("Token");
  }
  if (!token) {
    return 
  }
  const socket = useSocket(token);
  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
