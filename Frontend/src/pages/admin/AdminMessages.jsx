import React, { useEffect, useState } from 'react';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/message/all');
        const data = await response.json();
        setMessages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="message-panel">
      <h2>All Messages</h2>
      <ul>
        {messages.map((message) => (
          <li key={message._id} className="message-item">
            <div className="message">
              <strong>Message:</strong> {message.message}
            </div>
            <div className="timestamp">
              <strong>Sent at:</strong> {new Date(message.timestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMessages;
