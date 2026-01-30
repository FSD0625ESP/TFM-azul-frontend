import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Determinar URL del WebSocket basado en el entorno
const getWebSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  if (apiUrl.includes("localhost")) {
    return "ws://localhost:4000";
  }
  // Si es producción (Render), usa wss:// y extrae el dominio
  const baseUrl = apiUrl.replace("/api", "").replace("https://", "");
  return `wss://${baseUrl}`;
};

export const WSContext = createContext();

export const WSProvider = ({ user, children }) => {
  const ws = useRef(null);
  const [chats, setChats] = useState({}); // { orderId: [messages] }
  const [unread, setUnread] = useState({}); // { orderId: count }

  useEffect(() => {
    if (!user) return;

    ws.current = new WebSocket(getWebSocketUrl());

    ws.current.onopen = () => {
      console.log("WS connected");
      const userId = user._id || user.id || null;
      // Identify this connection so server can notify this user even
      // if they don't have a room open
      ws.current.send(
        JSON.stringify({ type: "identify", userId, userType: user.role }),
      );
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        const orderId = data.orderId || "general";
        const myId = user._id || user.id || null;
        const isFromMe = String(data.fromId) === String(myId);

        setChats((prev) => ({
          ...prev,
          [orderId]: [...(prev[orderId] || []), data],
        }));

        // Increase unread count only if message is not from current user
        if (!isFromMe) {
          setUnread((prev) => ({
            ...prev,
            [orderId]: (prev[orderId] || 0) + 1,
          }));

          // Notify user with a toast only if message is not from current user
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
      // Reservation cancelled notification (from rider)
      if (data.type === "reservation_cancelled") {
        // If current user is the store for this order, show toast
        const myId = user._id || user.id || null;
        const shopId = data.shopId || data.storeId || null;
        // We don't always know shopId in payload, but the server sends to the shop userId
        if (String(myId) !== "null") {
          toast.info(data.message || "Reserva cancelada", {
            autoClose: 5000,
          });
        }
      }
    };

    ws.current.onclose = () => console.log("WS disconnected");

    return () => ws.current.close();
  }, [user]);

  const joinRoom = (orderId) => {
    const userId = user._id || user.id || null;
    ws.current?.send(
      JSON.stringify({ type: "join", orderId, userType: user.role, userId }),
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
      }),
    );
  };

  return (
    <WSContext.Provider value={{ chats, joinRoom, sendMessage, unread }}>
      {children}
    </WSContext.Provider>
  );
};
