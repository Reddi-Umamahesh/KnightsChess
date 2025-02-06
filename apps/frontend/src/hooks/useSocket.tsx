// src/hooks/useWebSocket.ts
import { USER_TOKEN } from "@/utils/constants";
import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8080";

const useWebSocket = (wsUrl: string = WS_URL) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Grab the token from localStorage (or however you want to retrieve it)
    const token = localStorage.getItem(USER_TOKEN);

    if (!token) {
      console.error("No token found in localStorage. WebSocket not established.");
      return;
    }

    // Create the full URL with token as a query parameter
    const fullUrl = `${wsUrl}?token=${token}`;
    const ws = new WebSocket(fullUrl);

    ws.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    ws.onerror = (error) => {
      console.error("WebSocket encountered an error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    // Save the socket instance in state
    setSocket(ws);

    // Cleanup function to close the socket when the component unmounts
    return () => {
      console.log("Cleaning up WebSocket connection.");
      ws.close();
    };
  }, [wsUrl]);

  return socket;
};

export default useWebSocket;
