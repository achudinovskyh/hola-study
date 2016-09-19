var express = require('express');
var app = express();
var http = require('http');
var mysql= require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());

http.createServer(app).listen(4444, function(){
    console.log('Express server listening on port 4444');
});
///achudo/day10-toDoList-with-DB
app.get('/', function(req, res){
    if(req.cookies.toDoId){
        res.sendfile(__dirname+"/index.html");
    }else{
        res.redirect("/login");
    }
});
///achudo/day10-toDoList-with-DB
app.get('/login', function(req, res){
    if(!req.cookies.toDoId){
        res.sendfile(__dirname+'/public/login.html');
    }else{
        res.redirect("/");
    }
});

var pool  = mysql.createPool({
    // host     : 'localhost',
    // user     : 'andy',
    // password : '1q2w3e4r',
    // database : 'andy_todolist'
    host     : 'localhost',
    user     : 'root',
    password : '1q2w3e4r',
    database : 'toDoList'
});

app.post('/', function(req, res) {
    pool.getConnection(function(err, connection) {
        var query = getAction(req);
        connection.query(query, function (err, result) {
            if(err) throw err;
            connection.release();
            res.send(result);
        });
    });
});

function getAction(req) {
    var action;
    if(req.body.action == "addTask"){
        action = "INSERT INTO tasks (`taskID`, `userID`, `status`, `task`) VALUES (NULL, '"+ req.body.userId +"', '"+ req.body.status +"', '"+ req.body.text+"');";
    }else if(req.body.action == "deleteTask"){
        action = "DELETE FROM tasks WHERE `taskID` = " +req.body.taskID;
    }else if(req.body.action == "updateTaskStatus"){
        action = 'UPDATE tasks SET status = '+ req.body.status +' WHERE taskID = '+ req.body.taskId +'';
    }else if(req.body.action == "updateTaskText"){
        action = 'UPDATE tasks SET task = "'+ req.body.text +'" WHERE taskID = '+ req.body.taskId +'';
    }else if(req.body.action == "deleteFinished"){
        action = "DELETE FROM tasks WHERE `userID` = "+ req.body.userId +" AND `status` = 1";
    }else if(req.body.action == "getAllTasks"){
        action = "SELECT * FROM tasks WHERE `userID` = " + req.body.userId;
    }else if(req.body.action == "getActiveTasks"){
        action = "SELECT * FROM tasks WHERE `status` = 0 AND `userID` =" + req.body.userId;
    }else if(req.body.action == "getFinishedTasks"){
        action = "SELECT * FROM tasks WHERE `status` = 1 AND `userID` = " + req.body.userId;
    }else if(req.body.action == "setCounter"){
        action = "SELECT COUNT(`taskID`) AS amount FROM tasks WHERE `status` = 0 AND `userID` = " + req.body.userId;
    }else if(req.body.action == "sellectAll"){
        var stat = req.cookies.filter == 2? "status" : req.cookies.filter;
        action = "UPDATE tasks SET status = "+ req.body.status +" WHERE userID = "+ req.body.userId +" AND status = "+ stat;
        console.log(action);
    }
    return action;
}


app.post('/checkUser', function(req, res) {
    pool.getConnection(function(err, connection) {
        var action = "SELECT `id` FROM `usersID` WHERE `name` = '"+ req.body.userName+"' AND `password` = '"+ req.body.password+ "'";

        connection.query(action, function (err, result) {
            if(err) throw err;
            connection.release();
            if(!result.length){
                res.send("Wrong UserName!");
            }else{
                console.log(result[0]);
                res.cookie('toDoId',result[0]['id'],{maxAge:600000});
                res.send("gotId");
                res.end();
            }
        });
    });
});

app.post('/newUser', function(req, res) {
    pool.getConnection(function(err, connection) {
        var action = "INSERT INTO `usersID` (`id`, `name`, `password`, `filter`) VALUES (NULL, '"+ req.body.userName +"', '"+ req.body.password+"', '1')";

        connection.query(action, function (err, result) {
            console.log(result);
            if(err) throw err;
            if(result){
                res.send("gotId");
                res.end();
            }else{
                res.send("Wrong UserName!");
            }
            connection.release();
        });
    });
});
