import React, { useState, useEffect, useRef } from "react";

const ChatBox = ({ orderId, userType, userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    // Conectar WS al montar el componente
    ws.current = new WebSocket("ws://localhost:4000"); // o tu URL de producción

    ws.current.onopen = () => {
      console.log("Connected to WS");

      // Unirse al chat del pedido
      ws.current.send(
        JSON.stringify({ type: "join", orderId, userType, userId })
      );
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "message") {
        setMessages((prev) => [...prev, data]);
      }
    };

    ws.current.onclose = () => console.log("WS disconnected");

    return () => ws.current.close();
  }, [orderId, userType, userId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    ws.current.send(JSON.stringify({ type: "message", content: input }));
    setInput("");
  };

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
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-emerald-500 px-4 rounded hover:bg-emerald-600"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
