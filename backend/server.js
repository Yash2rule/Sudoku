const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./users')
dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(require('cors')())
app.use(express.json());

const io = socketio(server,{
    cors: {
        origin: "*"
    }
});

io.on('connection',(socket) => {
    
    socket.on('joinRoom', ({room,username}) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room);
        socket.broadcast.to(user.room).emit('message',`${user.username} has joined this game`);
        io.to(user.room).emit('roomusers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    socket.on('grid', ({puzzle}) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('gridUpdate',puzzle);
    })

    socket.on('completion', () => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('win');
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if (user) {
            io.to(user.room).emit('message', `${user.username} has left the game`)
            io.to(user.room).emit('roomusers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../frontend/build')));
    app.get('*',(req,res) => {
        res.sendFile(path.join(__dirname,'../frontend/build/index.html'))
    })
}

const PORT = process.env.PORT || 5000;
server.listen(PORT,() => console.log(`Server running on port ${PORT}`));