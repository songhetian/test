const fs =  require('fs');
const http = require('http');
// process.nextTick(() => {
//   setTimeout(() => console.log('nextTick timeout finished'), 10);
// });
// setImmediate(() => console.log('immediate finished 1'));
// setTimeout(() => console.log('timeout finished'), 10);
//
// process.nextTick(() => console.log('nextTick finished'));
//
// Promise.resolve('test').then((result) => console.log(result));


//可读可写流////////////////////////////////////////////////////////////////

const Server = http.createServer();
Server.on('request', (req, res) => {
  const readable = fs.createReadStream(__dirname + '/test.txt',{encoding: 'utf-8',start:10});
  const writable = fs.createWriteStream(__dirname + '/t.txt');
  readable.on('error', (err) => {
      console.error(err);
      res.statusCode = 500;
      res.end("File not found");
  });
  readable.on('data', (data) => {
      res.write(data);
  });
  //管道
  // readable.pipe(res);
  // readable.pipe(writable);
  readable.on('close', () =>{
    console.log('关闭了');
    writable.end();
    res.end();
  });
});

Server.listen(8000,'127.0.0.1',() => {
  console.log("Listening on port 8000" );
});



