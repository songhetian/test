const fs = require('fs');



/////普通读文件////////////////////////////////

fs.readFile(__dirname + '/test.txt','utf-8',function(err,data){
    if(err) console.error(err);
    console.log(data);
});


//////流读取////////////////////////////////

const rs = fs.createReadStream(__dirname + '/test.txt',{
    start : 0,
    end: 16,
    highWaterMark:10 * 1024 * 1024
});
const ws = fs.createWriteStream(__dirname + '/test2.txt',{
    flags:'a'
});
rs.on('open',function(){
    console.log("可读流打开");
});
rs.on('close',function(){
    console.log("可读流关闭");
    ws.end();
});
ws.on('open',function(){
    console.log("可写流打开");
});
ws.on('close',function(){
    console.log("可写流关闭");
});
rs.on('data',function(data){
    console.log(data.length);
    ws.write(data);
});

