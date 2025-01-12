const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: 'https://chat-app-8373-q56pyjjnu-maxs-projects-f7e7037c.vercel.app',
      methods: ['GET', 'POST'],
    },
});

app.use(express.static('public'));

const users = {};

io.on('connection', (socket) => {
    socket.on('sendMessage', (msg) => {
        io.emit('responseMessage', msg);
    });

    socket.on('joinChat', (data) => {
        const { username, id, avatar } = data;
        users[socket.id] = { username, id, avatar };
        io.emit('onlineUsers', users);
    });

    socket.on('disconnect', () => {    
        delete users[socket.id];
        io.emit('onlineUsers', users);
    });

    socket.on('leaveChat', () => {    
        delete users[socket.id];
        io.emit('onlineUsers', users);
    });

    socket.on('typing', (username) => {
        socket.broadcast.emit('userTyping', username);
    });
    
    socket.on('stopTyping', (username) => {
        socket.broadcast.emit('userStoppedTyping', username);
    });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));