var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var users = {};
var typers = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

    socket.on('new user', function (data, callback) {
        if (data in users) {
            callback(false);
        } else {
            socket.broadcast.emit('chat message', data + " connected.");
            socket.name = data;
            users[socket.name] = socket;
            getUsers();
            callback(true);
        }
    });

    socket.on('new message', function (msg, callback) {
        if (msg.substr(0, 3) == "/pm") {
            msg = msg.substr(4);
            var name = msg.substr(0, msg.indexOf(' '));
            if (name in users) {
                callback(getTime() + " " + "to: " + msg);
                msg = getTime() + " " + "from: " + socket.name + msg.substr(msg.indexOf(" "));
                users[name].emit('chat message', msg)
            } else {
                callback("Incorect username!")
            }
        } else {
            msg = getTime() + " " + socket.name + " : " + msg;
            socket.broadcast.emit('chat message', msg);
            callback(msg);
        }
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('chat message', socket.name + " disconnected.");
        delete users[socket.name];
        getUsers();
    });

    socket.on('typing', function () {
        typers[socket.name] = "typing";
        showTypers(this);
    });

    socket.on('stop typing', function () {
        delete typers[socket.name];
        showTypers(this);
    });

    function showTypers(socket) {
        var html = "";
        var typingUsers = Object.keys(typers);
        for (var i = 0; i < typingUsers.length; i++) {
            html += typingUsers[i] + " ";
        }
        if (html) {
            html += " is typing now.";
        }
        socket.broadcast.emit('user is typing', html);
    }

    function getUsers() {
        io.emit('get users', Object.keys(users));
    }
});

function getTime() {
    var date = new Date();
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

http.listen('3000');
