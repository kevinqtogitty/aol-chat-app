import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import { createServer } from 'http';
const app = express();
app.use(cors());
const server = createServer(app);
const socketIO = new Server(server, {
  cors: { origin: 'http://localhost:5173' }
});

const port = 4000;

socketIO.on('connection', (socket: any) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });

  socket.on('join_room', (data: { username: string; roomID: string }) => {
    socket.join(data.roomID);
    socket.to(data.roomID).emit('user_joined', {
      username: data.username,
      message: 'has joined the chat!'
    });
    console.log(`User ${data.username} has joined room ${data.roomID}`);
  });

  socket.on('leave_room', (data: { username: string; roomID: string }) => {
    socket.leave(data.roomID);
    socket.to(data.roomID).emit('user_has_left', {
      username: data.username,
      message: 'has left the chat!'
    });
  });

  socket.on(
    'send_message',
    (data: {
      roomID: string;
      author: string;
      message: string;
      time: string;
    }) => {
      socket.to(data.roomID).emit('receive_message', data);
    }
  );
});

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});

server.listen(port, () => {
  console.log(`Server is listening on Port ${port}`);
});
