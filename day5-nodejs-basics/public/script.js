var socket = io.connect('http://localhost:3000');

$('#userForm').submit(function(){
    socket.emit('new user', $('#userName').val(),function(response){
        if(response){
            $('.userName').hide();
            $('.chatWindow').show();
        }else{
            $('#welcomeMessage').text('User with this name already exists!')
        }
    });
    $('#userName').val('');
    return false;
});

$('#chatForm').submit(function(){
    socket.emit('new message', $('#m').val(),function(response){
        $('#messages').append($('<li>').text(response));
    });
    $('#m').val('');
    return false;
});

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});

socket.on('get users', function(users){
    $('#users').html("");
    for(var i = 0; i < users.length;i++){
        $('#users').append($('<li>').text(users[i]));
    }
});

$("#m").bind('keydown', function () {
    socket.emit('typing', "");
});

$("#m").bind('blur', function () {
    socket.emit('stop typing', "");
});

socket.on('user is typing', function (html) {
    $("#typers").text(html);
});