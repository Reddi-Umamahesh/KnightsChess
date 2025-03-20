import { USER_TOKEN, ws_url } from "@/utils/constants";
import { useEffect,  useState } from "react";

const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const wsurl = ws_url + "?token=";

  useEffect(() => {
    const token = localStorage.getItem(USER_TOKEN);
    if (token) {
      setToken(token);
      // console.log("Token found:", token);
    } else {
      // console.log("No token found");
    }
  }, []);

  const createWebSocket = () => {
    if (!token) return;

    const url = wsurl + token;
    // console.log("Connecting to WebSocket with URL:", url);

    const ws = new WebSocket(url);

    ws.onopen = () => {
      // console.log("Connected to WebSocket server");
      setSocket(ws);
    };

    ws.onclose = () => {
      // console.log("Disconnected from WebSocket server", event.code);
      setSocket(null);

      setTimeout(() => {
        // console.log("Attempting to reconnect...");
        createWebSocket();
      }, 1000); 
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return ws;
  };

  useEffect(() => {
    if (!token) return;

    const ws = createWebSocket();

    return () => {
      ws?.close();
      setSocket(null);
    };
  }, [token]);

  return { socket  };
};

export default useWebSocket;
