import React, { useState } from 'react';
import Chat from './Chat';
import Sidebar from './Sidebar';
import '../styles/Chat.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [receiverId, setReceiverId] = useState('');

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    setReceiverId(userId);
    if (!users.includes(userId)) {
      setUsers((prevUsers) => [...prevUsers, userId]);
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter(user => user !== userId));
    if (selectedUser === userId) {
      setSelectedUser('');
      setReceiverId('');
    }
  };

  return (
    <div id="root">
      <Sidebar
        users={users}
        onUserSelect={handleUserSelect}
        selectedUser={selectedUser}
        onDeleteUser={handleDeleteUser}
      />
      <div className="chat-container">
        {receiverId && (
          <Chat userId={selectedUser} contact={{ _id: receiverId }} />
        )}
      </div>
    </div>
  );
};

export default App;
