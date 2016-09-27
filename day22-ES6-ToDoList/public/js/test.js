'use strict';
let mapOfTasks = new Map();

const ENTER = 13;
const ESC = 27;

class Task {
    constructor(taskID, task, status = false) {
        this._taskID = taskID;
        this._task = task;
        this._status = status;
    }

    get status() {
        return this._status;
    }

    set status(status) {
        this._status = status;
    }

    get title() {
        return this._task;
    }

    set title(title) {
        this._task = title;
    }

    get id() {
        return this._taskID;
    }
}

function addNewTaskToDB(userId, text) {
    return new Promise((resolve, reject) => {
        let id = $.ajax({
            type: 'POST',
            data: JSON.stringify({userId, text}),
            contentType: 'application/json',
            url: '/test',
            success: (response) => {
                return response
            },
            error: (error) => {
                reject(error)
            }
        });
        resolve({id, text, status: false});
    })
}

function createTasksObj(tasks) {
    console.log("tasks-log");
    console.log(tasks);
    console.log("======");
    return new Promise((resolve, reject) => {
        (function iterator(i) {
            if (i < tasks.length) {
                mapOfTasks.set(mapOfTasks.size, new Task(tasks[i]));
                iterator(++i);
            } else {
                if (!arr.length) {
                    reject(new Error("Error: no tasks to create."));
                }
            }
        })(0);
    })
}


function handleOnKeyUp(event) {
    let text = $('#task');
    if (event.keyCode == ESC) {
        text.val("");
    } else if (event.keyCode == ENTER) {
        if (!!text.val()) {
            addNewTaskToDB(1, text.val())
                .then((responseFromDB) => {
                    console.log(responseFromDB);
                    return new Promise((resolve) => {
                        let newTask = new Task(responseFromDB);
                        mapOfTasks.set(mapOfTasks.size, newTask);
                        resolve(newTask);
                    })
                })//createTasksObj(responseFromDB)
                .then(renderTask)
                .catch(() => console.log(error));
        }
    }
}

function renderTask(task) {
    //<li><div class="liHolder"><input type="checkbox"><div><span>text</span><input style="display: none;"></div></div><div class="close">X</div></li>
    let _id = task.id;
    $("#list").append(
        $('<li/>', {id: _id}).append(
            $('<div/>', {'class': 'liHolder', id: `div${_id}`}).append(
                $('<input>', {
                    'type': 'checkbox',
                    click: checkboxHandler,
                    checked: task.status
                }).prop('data-id', _id)).append(
                $('<div/>', {dblclick: switchToInput}).prop('data-id', _id).append(
                    $('<span/>', {text: `${task.title}`, id: `span${_id}`})).append(
                    $('<input>', {
                        type: 'text',
                        style: 'display:none',
                        keyup: inputOnKeyUp,
                        blur: inputOnBlur,
                        id: `input${_id}`
                    }).prop('data-id', _id)))).append(
            $('<div/>', {class: 'close', text: 'X', click: deleteTask}).prop('data-id', _id)));

}
let button = creteelement(button)
button.data("id",id);

function deleteTask() {
    $(`#${this.data - id}`).remove();
}

function checkboxHandler() {
    if (this.checked) {
        $(`#div${this.data - id}`).addClass('lineThrowgh');
    } else {
        $(`#div${this.data - id}`).removeClass('lineThrowgh');
    }
}

function switchToInput() {
    let text = $(`#span${this.data - id}`).hide().text();
    $(`#input${this.data - id}`).val(text).show().focus();
}

function inputOnKeyUp(event) {
    let span = $(`#span${this.data - id}`);

    if (event.keyCode === ENTER) {
        this.style = "display:none";
        span.text(this.value).show();
    } else if (event.keyCode === ESC) {
        this.style = "display:none";
        span.show();
    }
}

function inputOnBlur() {
    this.style = "display:none";
    $(`#span${this.data - id}`).show();
}