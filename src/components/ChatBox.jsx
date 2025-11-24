import React, { useState, useEffect, useContext } from "react";
import { WSContext } from "../context/WebSocketContext";

const ChatBox = ({ orderId }) => {
  const { chats, joinRoom, sendMessage } = useContext(WSContext);
  const [input, setInput] = useState("");

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
      <div className="flex-1 overflow-auto mb-2 p-2 bg-gray-900 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1">
            <span className="font-bold">{msg.from}:</span> {msg.content}
          </div>
        ))}
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
