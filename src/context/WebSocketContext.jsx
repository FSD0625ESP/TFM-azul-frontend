import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL, getWebSocketUrl } from "../utils/apiConfig";

export const WSContext = createContext();

export const WSProvider = ({ user, children }) => {
  const ws = useRef(null);
  const [chats, setChats] = useState({}); // { orderId: [messages] }
  const [unread, setUnread] = useState({}); // { orderId: count }

  useEffect(() => {
    if (!user) return;

    // Intentar conectar WebSocket con manejo de errores
    try {
      ws.current = new WebSocket(getWebSocketUrl());

      ws.current.onopen = () => {
        console.log("WS connected");
        const userId = user._id || user.id || null;
        ws.current.send(
          JSON.stringify({ type: "identify", userId, userType: user.role })
        );
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          const orderId = data.orderId || "general";
          setChats((prev) => ({
            ...prev,
            [orderId]: [...(prev[orderId] || []), data],
          }));
          setUnread((prev) => ({
            ...prev,
            [orderId]: (prev[orderId] || 0) + 1,
          }));

          const myId = user._id || user.id || null;
          if (String(data.fromId) !== String(myId)) {
            toast.info(`${data.from || "Nuevo mensaje"}: ${data.content}`, {
              onClick: () => {
                try {
                  joinRoom(orderId);
                } catch (e) {
                  console.error("Error joining room from toast click", e);
                }
              },
              autoClose: 5000,
            });
          }
        }
        if (data.type === "reservation_cancelled") {
          const myId = user._id || user.id || null;
          if (String(myId) !== "null") {
            toast.info(data.message || "Reserva cancelada", {
              autoClose: 5000,
            });
          }
        }
      };

      ws.current.onclose = () => {
        console.log("WS disconnected");
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [user]);

  const joinRoom = (orderId) => {
    const userId = user._id || user.id || null;
    ws.current?.send(
      JSON.stringify({ type: "join", orderId, userType: user.role, userId })
    );

    // Fetch history from server and clear unread for this order
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/messages/order/${orderId}`);
        const msgs = res.data.messages || [];
        setChats((prev) => ({ ...prev, [orderId]: msgs }));
        // mark as read on server
        await axios.post(`${API_URL}/messages/order/${orderId}/read`);
        setUnread((prev) => ({ ...prev, [orderId]: 0 }));
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    })();
  };

  const sendMessage = (orderId, content) => {
    const userId = user._id || user.id || null;
    ws.current?.send(
      JSON.stringify({
        type: "message",
        orderId,
        content,
        userId,
        userType: user.role,
      })
    );
  };

  return (
    <WSContext.Provider value={{ chats, joinRoom, sendMessage, unread }}>
      {children}
    </WSContext.Provider>
  );
};
