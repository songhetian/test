const fs = require('fs');

///普通写入////////////////////////////////

fs.writeFile(__dirname+'/test.txt','测试',{flag:'a'},(err) => {
    if(err) {
        console.log(err);
    }
});


////////流写入////////////////////////////////

/**
 * 1.创建流
 */
const ws = fs.createWriteStream(__dirname+'/test1.txt',{flags:'a'});

ws.on('open',()=>{
    console.log('流打开了');
});
ws.on('close',()=>{
    console.log('流关闭了');
});
//写入
ws.write("test1");
ws.write("test2");
ws.write("test3");
//关闭流
ws.end();