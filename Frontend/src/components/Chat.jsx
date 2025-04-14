// src/components/Chat.jsx
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'], // fallback support
  withCredentials: true, // optional depending on CORS
});


const Chat = ({ sender, receiver }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef(null);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    socket.emit('join-room', sender);

    axios.get(`http://localhost:5000/api/messages/${sender}/${receiver}`)
      .then(res => setMessages(res.data));

    socket.on('receive-message', (msg) => {
      if (msg.receiverId === sender) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.disconnect(); // only disconnect this ref
    };
  }, [sender, receiver]);

  
  const handleSend = () => {
    if (newMsg.trim()) {
      const msgData = {
        senderId: sender,
        receiverId: receiver,
        message: newMsg
      };
      socket.emit('private-message', msgData);
      setMessages((prev) => [...prev, { ...msgData, timestamp: new Date() }]);
      setNewMsg('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="border rounded shadow p-4 max-w-lg mx-auto my-5">
      <h2 className="text-xl font-semibold mb-2">Chat with Admin</h2>
      <div className="h-64 overflow-y-auto mb-2 bg-gray-100 p-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-1 p-2 rounded w-fit max-w-[80%] ${msg.senderId === sender ? 'bg-blue-200 ml-auto' : 'bg-green-200'
              }`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-2"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message"
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
