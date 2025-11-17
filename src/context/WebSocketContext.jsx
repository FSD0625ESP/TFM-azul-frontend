import React, { createContext, useState, useEffect, useRef } from "react";

export const WSContext = createContext();

export const WSProvider = ({ user, children }) => {
  const ws = useRef(null);
  const [chats, setChats] = useState({}); // { orderId: [messages] }

  useEffect(() => {
    if (!user) return;

    ws.current = new WebSocket("ws://localhost:4000");

    ws.current.onopen = () => {
      console.log("WS connected");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        setChats((prev) => {
          const orderId = data.orderId || "general";
          return { ...prev, [orderId]: [...(prev[orderId] || []), data] };
        });
      }
    };

    ws.current.onclose = () => console.log("WS disconnected");

    return () => ws.current.close();
  }, [user]);

  const joinRoom = (orderId) => {
    ws.current?.send(
      JSON.stringify({
        type: "join",
        orderId,
        userType: user.role,
        userId: user._id,
      })
    );
  };

  const sendMessage = (orderId, content) => {
    ws.current?.send(JSON.stringify({ type: "message", orderId, content }));
  };

  return (
    <WSContext.Provider value={{ chats, joinRoom, sendMessage }}>
      {children}
    </WSContext.Provider>
  );
};
