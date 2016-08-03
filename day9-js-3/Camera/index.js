var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];
var busy = false;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    if(users.indexOf(socket) == -1){
        users.push(socket);
        if(!busy){
            letThemPlay();
        }else{
            socket.emit('wait',"Please wait!");
        }
    }

    socket.on('disconnect', function(){
        if(users.indexOf(socket) == 0){
            stopControl();
        }else{
            users.splice(users.indexOf(socket));
        }
    });

});

function letThemPlay() {
    busy = true;
    users[0].emit('take control');
    setTimeout(stopControl, 15000);
    wait();
}

function stopControl() {
    users[0].emit('loose control');
    users.shift();
    if(users.length != 0){
        letThemPlay();
    }else{
        busy = false;
    }
}

function wait(){
    for(var i = 1; i < users.length; i++){
        users[i].emit('wait', "Please wait, it will take less than: " + i + "minutes!");
    }
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});