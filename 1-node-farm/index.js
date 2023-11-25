const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./module/replaceTemplate');

// const textIn =  fs.readFileSync('./txt/input.txt','utf-8');
//
// console.log(textIn);
//
// const textOut = `我是第一个输出的内容${Date.now()} \r\n${textIn}`;
//
// fs.writeFileSync('./txt/output.txt',textOut);
//
// const date = new Date();
// console.log(date.toLocaleDateString());

////FILE
// fs.readFile('./txt/start.txt','utf-8',(err,data) => {
//     if (err) {
//         console.log(err.message);
//         return;
//     }
//     fs.readFile(`./txt/${data}.txt`,'utf-8',(err,data1) => {
//         fs.writeFile('./txt/final.txt',data1,'utf-8',(err) => {
//         });
//     });
// });

/////////SERVER////////////////////////////////

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer(function (req, res) {
    const {pathname,query} = url.parse(req.url,true);
    //overview
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{
            'Content-Type': 'text/html',
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(templateCard,el)).join('');
        const output = templateOverview.replace(/{%PRODUCT_CARDS%}/g,cardsHtml);
        res.end(output);
    } else if(pathname === '/product') {
        //product
        const product = dataObj.find(el => el.id === +query.id);
        const output = replaceTemplate(templateProduct,product);
        res.writeHead(200,{
            'Content-Type': 'text/html'
        });

        res.end(output);
    }else if (pathname === '/api') {
        //api
        res.writeHead(200,{
            'Content-Type': 'application/json'
        });
        res.end(data);
    }else{
        res.writeHead(404,{
            'Content-type':'text/html',
        });

        res.end("<h1>not found</h1>");
    }
});

server.listen(8000,'127.0.0.1',() => {
    console.log("Listening on port 8000" );
});
