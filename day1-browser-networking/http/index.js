var http = require('http');
var url = require('url');

function handleRequest(req, res) {
    var parsedUrl = url.parse(request.url, true);
    var message = parsedRequest.query.message;
    response.end(message);
}

var server = http.createServer(handleRequest);

server.listen("3001", function(){  
    console.log("Server listening on: *3001");
});