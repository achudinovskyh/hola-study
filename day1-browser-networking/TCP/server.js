var net = require('net');

var server = net.createServer(function(socket) {
    socket.on('data', function(data) {
        console.log(getTime() + " ip: " + socket.remoteAddress + "message: " + data);
        socket.write('Echo');
	    socket.pipe(socket);
    });

    socket.on('close', function() {
        console.log(getTime() + " ip: " + socket.remoteAddress + "disconnect");
    });
});

server.listen(3002, function() {
    console.log('Server listening on : 3002');
});

function getTime(){
    var date = new Date();
    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return time;
}
