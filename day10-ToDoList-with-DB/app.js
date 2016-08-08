var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var mysql= require('mysql');
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port 3000');
});

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '1q2w3e4r',
    database : 'toDoList'
});

app.post('/', function(req, res) {
    pool.getConnection(function(err, connection) {
        var query = getAction(req);
        connection.query(query, function (err, result,fields) {
            if(err) throw err;
            return res.send(result);

        });
    });
});

function getAction(req) {
    var action;
    if(req.body.action == "addTask"){
        action = "INSERT INTO `tasks` (`taskID`, `userID`, `status`, `task`) VALUES (NULL, '"+ req.body.userId +"', '"+ req.body.status +"', '"+ req.body.text+"')";
    }else if(req.body.action == "deleteTask"){
        action = "DELETE FROM `tasks` WHERE `taskID` = " +req.body.taskID;
    }else if(req.body.action == "updateTaskStatus"){
        action = 'UPDATE tasks SET status = '+ req.body.status +' WHERE taskID = '+ req.body.taskId +'';
    }else if(req.body.action == "updateTaskText"){
        action = 'UPDATE tasks SET task = "'+ req.body.text +'" WHERE taskID = '+ req.body.taskId +'';
    }else if(req.body.action == "deleteFinished"){
        action = "DELETE FROM `tasks` WHERE `status` = 1";
    }else if(req.body.action == "getAllTasks"){
        action = "SELECT * FROM `tasks` WHERE `userID` = " + req.body.userId;
    }else if(req.body.action == "getActiveTasks"){
        action = "SELECT * FROM `tasks` WHERE `status` = 0 AND `userID` =" + req.body.userId;
    }else if(req.body.action == "getFinishedTasks"){
        action = "SELECT * FROM `tasks` WHERE `status` = 1 AND `userID` = " + req.body.userId;
    }
    return action;
}