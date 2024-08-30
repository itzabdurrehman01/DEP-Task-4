import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const Chat = ({ userId, contact }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:4000');
    
    socketRef.current.emit('join', { userId, contactId: contact._id });
    
    socketRef.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, contact._id]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      sender: userId,
      receiver: contact._id,
      content: newMessage,
      timestamp: new Date(),
    };

    socketRef.current.emit('sendMessage', messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="message-list">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.sender === userId ? 'sent' : 'received'}`}
          >
            <strong>{message.sender}</strong>: {message.content}
            <div className="timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
