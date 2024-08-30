import React, { useState } from 'react';

const Sidebar = ({ users, onUserSelect, selectedUser, onDeleteUser }) => {
  const [newUserId, setNewUserId] = useState('');

  const addUser = () => {
    if (newUserId.trim() && !users.includes(newUserId.trim())) {
      onUserSelect(newUserId.trim());
      setNewUserId('');
    }
  };

  return (
    <div className="sidebar">
      <input
        type="text"
        placeholder="Enter user ID"
        value={newUserId}
        onChange={(e) => setNewUserId(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addUser()}
      />
      <button onClick={addUser}>Add</button>
      <ul className="user-list">
        {users.map((user, index) => (
          <li
            key={index}
            className={user === selectedUser ? 'active' : ''}
            onClick={() => onUserSelect(user)}
          >
            <span>{user}</span>
            <button 
              className="delete-button" 
              onClick={(e) => {
                e.stopPropagation(); // Prevents selecting the user when deleting
                onDeleteUser(user);
              }}
            >
              &#10005; {/* X icon for delete */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
