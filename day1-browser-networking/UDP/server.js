var dgram = require('dgram');
var server = dgram.createSocket('udp4');


server.on('message', function (message, rinfo) {
    console.log(getTime() +remote.address + ':' + remote.port +' - ' + message);
    server.send(message, 0, message.length,  3003, 'localhost');
});

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.bind(3003, 'localhost');

function getTime(){
    var date = new Date();
    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return time;
}