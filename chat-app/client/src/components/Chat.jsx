import React, { useState, useEffect } from "react";

function Chat({ socket, userName }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on("messageResponse", (data) => {
      setMessageList((prev) => [...prev, data]);
    });

    return () => {
      socket.off("messageResponse");
    };
  }, [socket]);

  const getTime = () => {
    const date = new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12:true });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        text: message,
        name: userName,
        time: getTime(), 
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      };

      socket.emit("message", messageData);

      setMessageList((prev) => [...prev, messageData]);

      setMessage("");
    }
  };

  return (
    <div className="chatContainer bg-gray-100 h-screen flex flex-col">
      <div className="messages flex-grow overflow-y-auto p-4 space-y-4">
        {messageList.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.socketID === socket.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                msg.socketID === socket.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              } max-w-[75%] p-3 rounded-lg shadow-md`}
            >
              <p className="font-semibold">{msg.name}</p>
              <p>{msg.text}</p>
              <p className="text-sm text-gray-400 mt-1 text-right">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center p-4 bg-white border-t border-gray-300"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
