const fs = require('fs');
const superagent = require('superagent');

const readFilePro = function(file) {
    return new Promise(function(resolve, reject) {
        fs.readFile(file, 'utf8', function(err,data){
            if (err) {
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
}

const writeFilePro = function(file, data) {
    return new Promise(function(resolve, reject){
        fs.writeFile(file, data, {flag:'a'},function(err){
            if (err) {
                reject(err)
            }else{
                resolve('success');
            }
        });
    });
}


// readFilePro(`${__dirname}/dog.txt`)
//     .then(data => {
//         console.log(`Breed: ${data}`);
//         return superagent.get(`https://dog.ceo/api/breed/labrador/images/random`);
//     })
//     .then(res => {
//         return writeFilePro('./dog-img.txt',res.body.message);
//     })
//     .then(() => {
//         console.log('success write');
//     })
//     .catch(err => {
//         console.log(err);
//     });

//定时器-系统-系统-io-check(setImmediate)-close
setImmediate(async () => {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    const resPro1 =  superagent.get(`https://dog.ceo/api/breed/labrador/images/random`);
    const resPro2 =  superagent.get(`https://dog.ceo/api/breed/labrador/images/random`);
    const resPro3 =  superagent.get(`https://dog.ceo/api/breed/labrador/images/random`);

    const res = await Promise.all([resPro1,resPro2,resPro3]);

    const img = res.map(el=>el.body.message);

    await writeFilePro('./dog-img.txt', img.join('\r\n'));
    console.log('success write');
});

(async () => {
    console.log(111);
})();