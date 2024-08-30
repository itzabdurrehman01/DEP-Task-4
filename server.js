const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const messageRoutes = require('./routes/messages');
app.use('/messages', messageRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
    const timestamp = new Date().toISOString();
    const message = new Message({ sender: senderId, receiver: receiverId, content, timestamp });
    await message.save();

    io.to(receiverId).emit('receiveMessage', { ...message._doc, timestamp });
    socket.broadcast.emit('notification', {
      senderId,
      content
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
