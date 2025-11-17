import { useEffect, useState } from "react";

export default function Chat({ riderId, storeId, orderId }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");
    setWs(socket);

    socket.onopen = () => {
      console.log("Connected to WS server");

      // JOIN al chat del pedido
      socket.send(
        JSON.stringify({
          type: "join",
          orderId,
          userType: riderId ? "rider" : "store",
          userId: riderId || storeId,
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        setMessages((prev) => [...prev, data]);
      }
    };

    return () => {
      socket.close();
    };
  }, [orderId, riderId, storeId]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !ws) return;

    ws.send(
      JSON.stringify({
        type: "message",
        content: inputMessage,
      })
    );

    setInputMessage("");
  };

  return (
    <div>
      <div style={{ height: "300px", overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.from}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}

const styles = {
  chatContainer: {
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #ccc",
    padding: "15px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    height: "500px",
  },
  messagesBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "10px",
    paddingRight: "5px",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "8px",
    maxWidth: "80%",
  },
  inputContainer: {
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "8px 16px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
