function QueueRunner(exec) {
    this.queue = [];
    this.running = false;
    this.pause = false;
    this.onfinish = function (result) {
        this.queue[0].onFinish(result);
        this.queue.shift();
        if(this.queue.length != 0 && !this.pause){
            exec(this.queue[0],this.onfinish);
        }else{
            this.running = false;
        }
    };
    this.onfinish = this.onfinish.bind(this);
    this.push = function(task){
        this.queue.push(task);
        if(!this.running){
            this.running = true;
            exec(task,this.onfinish);
        }
    };
    this.pause = function () {
        this.pause = true;
    };
    this.resume = function () {
        this.pause = false;
        if(this.queue.length != 0 && !this.running){
            this.running = true;
            exec(this.queue[0],this.onfinish)
        }
    }
    this.cleanup = function () {
        while(this.queue.length != 0){
            this.queue[0].onFinish("CANCELLED");
            this.queue.shift();
        }
    }
}

function test(data,onfinish) {
    var result = data[1] + data[2];
    onfinish(result);
}

function callback(result) {
    console.log(result);
}
qr = new QueueRunner(test,callback);

var taske = {1:5,2:7,onFinish:callback}
qr.push(taske);
var taske1 = {1:5,2:1,onFinish:callback}
qr.push(taske1);

