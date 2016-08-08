var buttonPosition;
var myuserID = 1;

function init() {

}

function addNewTask(taskId,text,status){
    console.log(status);
    document.getElementById("task").value = "";

    var list = document.getElementById("list");
    var li = document.createElement("li");
    list.appendChild(li);

    var div1 = document.createElement("div");
    div1.className = "liHolder";

    var div2 = document.createElement("div");
    div2.className = "close";
    div2.innerHTML = "X";
    div2.dataID = taskId;
    div2.onclick = function(){
        sendDeleteTaskRequest("deleteTask",this.dataID);
        this.parentElement.remove();
        setCounter();
    };

    li.appendChild(div1);
    li.appendChild(div2);

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataID = taskId;
    if(status){
        checkbox.checked = true;
        div1.className += " lineThrowgh";
    }
    checkbox.onclick = function(){
        var temp = this.parentElement;
        if(this.checked){
            temp.className += " lineThrowgh";
            sendUpdateStatusRequest(this.dataID,1);
        }else{
            temp.className = temp.className.replace(" lineThrowgh","");
            sendUpdateStatusRequest(this.dataID,0);
        }
        setCounter();
    };

    div1.appendChild(checkbox);

    var divText = document.createElement("div");
    var span = document.createElement("span");
    span.dataID = taskId;
    span.appendChild(document.createTextNode(text));
    var input = document.createElement("input");
    input.style = "display:none;";
    input.dataID = taskId;
    divText.ondblclick = function(){
        var text = this.firstChild.innerText;
        this.firstChild.style = "display:none";
        this.lastChild.style = "display:block";
        this.lastChild.value = text;
        this.lastChild.focus();
    };

    input.onkeydown = function(event){
        if(event.keyCode === 13){
            this.parentElement.firstChild.innerText = this.value;
            this.style = "display:none";
            this.parentElement.firstChild.style = "display:block";
            sendUpdateTextRequest(this.dataID,this.value);
            return;
        }
        if(event.keyCode === 27){
            this.style = "display:none";
            this.parentElement.firstChild.style = "display:block";
        }
    };

    input.onblur = function(){
        this.style = "display:none";
        this.parentElement.firstChild.style = "display:block";
    };

    div1.appendChild(divText);
    divText.appendChild(span);
    divText.appendChild(input);
    setCounter();
}
function selectFinishedTasksRequest() {
    buttonPosition = 3;
    var data = {action: "getFinishedTasks", userId:myuserID};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/',
        success: function(tasks) {
            showTasks(tasks);
        }
    });
}
function selectActiveTasksRequest() {
    buttonPosition = 2;
    var data = {action: "getActiveTasks", userId:myuserID};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/',
        success: function(tasks) {
           showTasks(tasks);
        }
    });
}

function selectAllTasksRequest() {
    buttonPosition = 1;
    var data = {action: "getAllTasks", userId:myuserID};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/',
        success: function(tasks) {
            showTasks(tasks);
        }
    });
}

function showTasks(tasks){
    document.getElementById("list").innerHTML = "";
    for(var i = 0; i < tasks.length; i++){
        addNewTask(tasks[i].taskID,tasks[i].task,tasks[i].status);
    }
}

function sendUpdateTextRequest(taskID,task) {
    var data = {action: "updateTaskText", taskId: taskID,text: task};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/',
        success: function(resData) {
            //console.log(resData);
        }
    });
}

function sendUpdateStatusRequest(taskID,checked) {
    var data = {action: "updateTaskStatus", taskId: taskID,status: checked};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/',
        success: function(resData) {
            //console.log(resData);
        }
    });
}

function sendAddTaskRequest(action, task) {
    var data = {action: "addTask", userId: myuserID, text:task, status: 0};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/',
        success: function(resData) {
            console.log(resData);
            return resData;
           // addNewTask(resData.insertId,task,0);
        }
    });
}

function sendDeleteTaskRequest(action, taskId) {
    var data = {action: "deleteTask", taskID: taskId};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/',
        success: function(data) {
            console.log("task deleted!");
        }
    });
}

function sendDeleteFinished() {
    var data = {action: "deleteFinished"};

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:3000/',
        success: function(data) {
            console.log("task deleted!");
        }
    });
}
function setCounter(){

    function selectFinished() {
        var data = {action: "getFinishedTasks", userId:myuserID};

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:3000/',
            success: function(tasks) {
                return tasks.length;
            }
        });
    }

    function selectAll() {
        var data = {action: "getAllTasks", userId:myuserID};

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:3000/',
            success: function(tasks) {
                return tasks.length;
            }
        });
    }

    document.getElementById("tasksLeft").innerHTML = "Task's left: " + (selectAll()-selectFinished());
}

function clearFinishedTasks(){
    sendDeleteFinished();
    var finishedTasks = document.getElementsByClassName("lineThrowgh");
    while(finishedTasks.length != 0){
        finishedTasks[0].parentElement.remove();
    }
}

function selectAll(checked){
    var elements = document.getElementsByClassName("liHolder");
    for(var i = 0; i < elements.length; i++){
        if(checked){
            if(tasksStorage.getItem(elements[i].innerText) === "false"){
                tasksStorage.setItem(elements[i].innerText,"true");
                elements[i].className += " lineThrowgh";
                elements[i].firstChild.checked = checked;
            }
        }else{
            if(tasksStorage.getItem(elements[i].innerText) === "true"){
                tasksStorage.setItem(elements[i].innerText,"false");
                elements[i].className = elements[i].className.replace(" lineThrowgh","");
                elements[i].firstChild.checked = checked;
            }
        }
    }
    setCounter()
}

function handleOnKeyDown(event){
    if(event.keyCode == 27){
        document.getElementById("task").value = "";
        return;
    }
    if(event.keyCode == 13){
        var task = document.getElementById("task").value;
        if(task !== ""){
            sendAddTaskRequest("addTask",task,0);
        }
    }
}
