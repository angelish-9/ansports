import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
});

const AdminMessages = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef(null);

  // If not admin or user is missing
  if (!userData || role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Not Authorized</h1>
      </div>
    );
  }

  const adminId = userData[0]._id;

  useEffect(() => {
    fetch('http://localhost:5000/api/message/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to load users:', err));
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;

    socket.emit('join-room', adminId);

    fetch(`http://localhost:5000/api/message/${adminId}/${selectedUserId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error('Message fetch error:', err));

    socket.on('receive-message', (msg) => {
      if (
        msg.senderId === selectedUserId &&
        msg.receiverId === adminId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off('receive-message');
  }, [selectedUserId]);

  const handleSend = () => {
    if (newMsg.trim()) {
      const msgData = {
        senderId: adminId,
        receiverId: selectedUserId,
        message: newMsg,
      };
      socket.emit('private-message', msgData);
      setMessages((prev) => [
        ...prev,
        { ...msgData, timestamp: new Date() },
      ]);
      setNewMsg('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex gap-4 p-4 h-screen">
      {/* Sidebar */}
      <div className="w-1/3 border-r pr-2 overflow-y-auto">
        <h3 className="font-bold mb-2">Users</h3>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              className={`cursor-pointer p-2 rounded ${
                selectedUserId === user._id
                  ? 'bg-blue-200'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => setSelectedUserId(user._id)}
            >
              {user.name || user.email}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat box */}
      <div className="w-2/3 flex flex-col">
        <h3 className="font-bold mb-2">Chat</h3>
        <div className="flex-1 overflow-y-auto bg-gray-100 p-2 rounded">
          {messages.map((msg, idx) => {
            const isAdmin =
              msg.senderId._id === adminId || msg.senderId === adminId;
            const timestamp = new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={idx}
                className={`my-1 flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2 rounded max-w-[80%] text-sm ${
                    isAdmin ? 'bg-blue-200' : 'bg-green-200'
                  }`}
                >
                  <p>{msg.message}</p>
                  <span className="text-xs text-gray-600 block mt-1 text-right">
                    {timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex mt-2 gap-2">
          <input
            type="text"
            className="flex-1 border px-2 rounded"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type your message"
          />
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
