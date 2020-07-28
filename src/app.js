const express = require('express');
const socketio = require('socket.io');
const app = express();
app.use(express.static(__dirname + '/public'))
const serverexpress = app.listen(3000);
const io = socketio(serverexpress);
users = [];
class Room {
    constructor(roomTitle) {
        this.roomTitle = roomTitle;
        this.history = []
    }
    addMessage(message) {
        this.history.push(message);
    }
}
const Rooms = []

io.on('connection', function(socket) {
    socket.on('newuser', function(data) {
        socket.username = data.name;
        const check = users.indexOf(socket.username);
        if (check == -1) {
            users.push(socket.username);
            socket.emit('check', { check: true });
            updateUsernames();

        } else {
            socket.emit('check', { check: false });
        }
    });

    socket.on('joinRoom', (Roomname) => {
        const RoomtoUpdate = Rooms.find((room) => {
            return room.roomTitle === Roomname;
        })
        if (!RoomtoUpdate) { Rooms.push(new Room(Roomname)); }
        socket.join(Roomname);
        if (RoomtoUpdate) { socket.emit('historyCatchUp', RoomtoUpdate.history); }

    })

    socket.on('msgToServer', (data) => {
        const RoomtoUpdate = Rooms.find((room) => {
            return room.roomTitle === data.Roomname;
        })
        RoomtoUpdate.history.push(data);
        console.log(Rooms);
        io.to(data.Roomname).emit('MessageToClient', data);
    })

    socket.on('disconnect', function(data) {
        console.log('log out' + socket.username);
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
    });

});

function updateUsernames() {
    console.log(users);
    io.sockets.emit('getusers', users);
}

io.to('').emit('message', { msg: 'hello world.' });