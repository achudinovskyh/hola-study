
var http = require('http');
var message = 'Hello Node.js';
var request = http.request({
    'hostname': 'localhost',
    'port': '3001',
    'path': '/?message=' + encodeURI(message),
    'method': 'GET'
});
request.on('response', function(response) {

    response.on('data', function(data) {
        var message = data.toString();
        console.log('Sent:  Hello Node.js\nServer response: ' + message);
    });

});
request.end();