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
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 scroll-smooth min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
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
                className={`flex ${isMine ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div
                  className={`max-w-[70%] break-words px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 ${
                    isMine
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                  }`}
                >
                  <div className="text-sm leading-relaxed font-medium">
                    {msg.content}
                  </div>
                  <div
                    className={`text-[11px] mt-2 font-light ${
                      isMine ? "text-emerald-100/80" : "text-slate-500"
                    } text-right`}
                  >
                    {time}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-2 px-4 py-3 bg-white border-t border-slate-200 shadow-lg flex-shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full bg-slate-100 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <button
          onClick={onSend}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-medium text-sm flex-shrink-0 whitespace-nowrap"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
