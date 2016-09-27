function checkUserInfo() {
    var data = {action : "checkUser",userName: $('#login').val(), password: $('#password').val()};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/checkUser',

        success: function (data) {
            if(data === "gotId"){
                document.location.href = "/";
            }else{
                alert(data);
            }
        }
    });
}

function createNewUser() {
    var data = {action : "newUser" ,userName: $('#login').val(), password: $('#password').val()};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/newUser',

        success: function (data) {
            if(data === "gotId"){
                checkUserInfo();
            }else{
                alert(data);
            }
        }
    });
}

