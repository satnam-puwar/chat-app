import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Chat from "./components/Chat";

const socket = io("http://localhost:4000");

function App() {
  const [userName, setUserName] = useState("");
  const [showChat, setShowChat] = useState(false);

  const handleJoinChat = () => {
    if (userName !== "") {
      socket.emit("newUser", userName);
      setShowChat(true);
    }
  };

  return (
    <div className="App h-screen flex items-center justify-center bg-gray-100">
      {!showChat ? (
        <div className="joinChatContainer bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <form onSubmit={handleJoinChat}>
            <h3 className="text-2xl font-bold text-center text-blue-500 mb-6">
              Join Chat
            </h3>
            <input
              type="text"
              placeholder="Enter your name..."
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
             type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Join
            </button>
          </form>
        </div>
      ) : (
        <Chat socket={socket} userName={userName} />
      )}
    </div>
  );
}

export default App;
