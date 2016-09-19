var tasksList = [];

function updateTasksList() {
    $.ajax({
        type: 'POST',
        data: JSON.stringify({userId: getCookie('toDoId')}),
        contentType: 'application/json',
        url: '/updateTasksList',
        //url: '/achudo/day10-toDoList-with-DB/',
        success: function (data) {
            
        }
    });
}

function showFiltredTasks() {
    switch (getCookie("filter")){
        case "0":
            for(var i = 0; i < tasksList.length; i++){
                if(tasksList[i].status == "0"){
                    showTask();
                }
            }
            break;
        
        case "1":
            for(var i = 0; i < tasksList.length; i++){
            
            }
            break;
        
        default:
            for(var i = 0; i < tasksList.length; i++){

            }
            break;
    }   
}

function showTask() {
    
}