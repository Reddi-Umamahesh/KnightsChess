// src/hooks/useWebSocket.ts
import { USER_TOKEN, ws_url } from "@/utils/constants";
import { useEffect, useState } from "react";



const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [token, setToken] = useState("");
  useEffect(() => {
    const storedToken = localStorage.getItem(USER_TOKEN) || "";
    console.log("Stored token", storedToken);
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    // const wsurl = `${ws_url}?token=${token}`;
    const wsurl = `ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhhZDA1NThjLTY0OTEtNDUwZC05ZTU3LTNlMjE1NDM0Y2M1YSIsImVtYWlsIjoidUBnbWFpbC5jb20iLCJuYW1lIjoidW1hbWFoZXNoIiwiaXNHdWVzdCI6ZmFsc2UsImlhdCI6MTc0MTM1MjAwMCwiZXhwIjoxNzQxMzcwMDAwfQ.sY0kARETyYkILH8dBuqCJva7Jadw5jGqS1X5Vqgbco4`;
    console.log(wsurl)
    const socket = new WebSocket(wsurl);
    console.log("Initial readyState:", socket.readyState, socket.url);
    setTimeout(() => console.log("After 5s, readyState:", socket.readyState), 5000);
    console.log("Connected to websocket", socket);

    socket.onopen = () => {
      console.log("WebSocket opened, readyState:", socket.readyState);
      setSocket(socket);
      console.log("Connected to websocket", socket);
    }
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    socket.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason)
      setSocket(null);
    }
    return () => {
      console.log("Cleaning up, closing socket");
      socket.close();
      setSocket(null);
    }
  }, [token]);
  return socket
};

export default useWebSocket;