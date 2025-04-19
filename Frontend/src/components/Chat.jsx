import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

// Socket initialization (outside to keep global)
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

const Chat = ({ receiver }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef(null);

  const sender = JSON.parse(localStorage.getItem('user'))[0]._id;

  useEffect(() => {
    if (!sender || !receiver) return;

    socket.emit('join-room', sender);

    // Fetch previous messages
    axios
      .get(`http://localhost:5000/api/message/${sender}/${receiver}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error('Fetch error:', err));

    // Listen for incoming messages
    socket.on('receive-message', (msg) => {
      if (msg.senderId === receiver && msg.receiverId === sender) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('receive-message');
    };
  }, [sender, receiver]);

  const handleSend = () => {
    if (newMsg.trim()) {
      const msgData = {
        senderId: sender,
        receiverId: receiver,
        message: newMsg,
        timestamp: new Date().toISOString(),
      };
      socket.emit('private-message', msgData);
      setMessages((prev) => [...prev, msgData]);
      setNewMsg('');
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="border rounded shadow p-4 max-w-lg mx-auto my-5">
      <h2 className="text-xl font-semibold mb-2">Chat</h2>
      <div className="h-64 overflow-y-auto mb-2 bg-gray-100 p-2 rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-1 p-2 rounded w-fit max-w-[80%] ${
              msg.senderId === sender ? 'bg-blue-200 ml-auto' : 'bg-green-200'
            }`}
          >
            <div>{msg.message}</div>
            <div className="text-xs text-gray-600 text-right mt-1">
              {msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </div>
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
