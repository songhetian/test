const fs = require('fs');
const {promisify} = require('util');
const READFILE = promisify(fs.readFile);

const readFile = function(path) {
    return new Promise((resolve, reject) =>{
        fs.readFile(path,'utf8', function(err,data){
            if (err) {
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
}

const promise = readFile('./dir/x.txt');
promise.then(result => {console.log(result);
                    return readFile('./dir/y.txt');
        })
        .then(result => {console.log(result);
                    return readFile('./dir/z.txt');
        })
        .then(result => console.log(result))
        .catch(err => console.log(err));

Promise.all([
    READFILE('./dir/x.txt','utf-8'),
    READFILE('./dir/y.txt','utf-8'),
    READFILE('./dir/z.txt','utf-8')
]).then(result => {console.log(result);});

///////async await /////

function  readFile1(path){
    fs.readFile(path,'utf8', function(err,data){
        if (err) {
            throw new Error(err);
        }else{
            console.log(data);
        }
    });
}

(async () => {
    try{
        const result1 = await readFile1('./dir/x.txt');
        const result2 = await readFile1('./dir/y.txt');
        const result3 = await readFile1('./dir/z.txt');

    }catch(err){
        console.error(err);
    }
})();

process.nextTick(() => {
    setTimeout(()=>console.log(4),50);
})
setTimeout(()=>console.log(1),50);
process.nextTick(()=>console.log(2));

setImmediate(()=>console.log(3));
