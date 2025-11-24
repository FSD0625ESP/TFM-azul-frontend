import React, { useState, useEffect, useContext } from "react";
import { WSContext } from "../context/WebSocketContext";

const ChatBox = ({ orderId }) => {
  const { chats, joinRoom, sendMessage } = useContext(WSContext);
  const [input, setInput] = useState("");

  // Determine current user id from localStorage to know which messages are mine
  let currentUserId = null;
  try {
    const raw = localStorage.getItem("user") || localStorage.getItem("store");
    const parsed = raw ? JSON.parse(raw) : null;
    currentUserId = parsed?._id || parsed?.id || null;
  } catch (e) {
    currentUserId = null;
  }

  // Join the room using the shared WS connection/provider
  useEffect(() => {
    if (!orderId) return;
    joinRoom(orderId);
  }, [orderId, joinRoom]);

  const onSend = () => {
    if (!input.trim()) return;
    sendMessage(orderId, input);
    setInput("");
  };

  const messages = chats[orderId] || [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto mb-2 p-2 bg-gray-900 rounded flex flex-col gap-2">
        {messages.map((msg, idx) => {
          const isMine =
            msg.fromId && String(msg.fromId) === String(currentUserId);
          const time = msg.timestamp
            ? new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";
          return (
            <div
              key={idx}
              className={`${isMine ? "justify-end" : "justify-start"} flex`}
            >
              <div
                className={`max-w-[80%] break-words px-3 py-2 rounded-lg ${
                  isMine
                    ? "bg-emerald-500 text-emerald-900"
                    : "bg-gray-700 text-white"
                }`}
              >
                <div className="text-sm leading-relaxed">{msg.content}</div>
                <div
                  className={`text-[10px] mt-1 ${
                    isMine ? "text-emerald-900/70" : "text-gray-300/70"
                  } text-right`}
                >
                  {time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <button
          onClick={onSend}
          className="bg-emerald-500 px-4 rounded hover:bg-emerald-600"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
