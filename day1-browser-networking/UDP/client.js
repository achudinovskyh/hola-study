var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var message = 'Hello Node.js'; 

client.send(message, 0, message.length,  3003, 'localhost');

client.on('message', function(data) {
    var message = data.toString();
    console.log('Recived: ' + message);
    client.close();
});
