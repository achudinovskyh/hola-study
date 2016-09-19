function checkUserInfo() {
    var login = $('#login').val();
    var pass = $('#password').val();

    var data = {action : "checkUser",userName: login, password: pass};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/checkUser',
        // /url: '/achudo/day10-toDoList-with-DB/checkUser',
        success: function (data) {
            if(data === "gotId"){
                document.location.href = "/";///achudo/day10-toDoList-with-DB/
            }else{
                alert(data);
            }
        }
    });
}

function createNewUser() {
    var login = $('#login').val();
    var pass = $('#password').val();

    var data = {action : "newUser" ,userName: login, password: pass};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/newUser',
        //url: '/achudo/day10-toDoList-with-DB/newUser',
        success: function (data) {
            if(data === "gotId"){
                checkUserInfo();
            }else{
                alert(data);
            }
        }
    });
}

