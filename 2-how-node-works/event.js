const EventEmitter = require('events');
const http = require('http');
//const myEventEmitter = new EventEmitter();
///////观察者模式////////////////////////////////
class Sales extends EventEmitter {
    constructor() {
        super();
    }
}

const myEventEmitter = new Sales();
myEventEmitter.on('newSales',() =>{
    console.log('newSales1');
});
myEventEmitter.on('newSales',(stock) =>{
    console.log(`${stock} items`);
});

myEventEmitter.emit('newSales',9);

///////////webserver////////////////////////////////

const server = http.createServer();

server.on('request',(req, res) =>{
    console.log('server request');
    console.log(req.url);
    res.end('websocket request');
});

server.on('close',()=> {
    console.log('关闭');
});

server.listen(8000,'127.0.0.1',()=>{
    console.log('开始');
});
