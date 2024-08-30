const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Fetch message history between two users
router.get('/:userId/:contactId', async (req, res) => {
  const { userId, contactId } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: contactId },
      { sender: contactId, receiver: userId }
    ]
  }).populate('sender', 'username').populate('receiver', 'username');
  
  res.json(messages);
});

module.exports = router;
