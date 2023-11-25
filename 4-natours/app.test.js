const express = require('express');
const app = express();
const homeRouter = require('./router/homeRouter');
app.use(express.urlencoded());
app.use(express.json());
app.use(function(req, res, next) {
  console.log('全局中间件');
  next();
});

const mw1 = (req,res,next)=>{
  console.log('调用了第一个局部生效的中间件');
  next()
}
const mw2 = (req,res,next)=> {
  console.log('调用了第二个局部生效的中间件');
  next()
}
app.get('/a*bcd',function(req,res){
      res.send('a*bcd');
});
//中间件/////////

app.get('/api',[mw1,mw2],(req,res) => {
  res.send('/api');
});

app.get('/',[mw1,mw2],(req,res)=>{
  res.send('Home page')
});

//路由中间件
app.route('/user/:id').get((req, res)=>{
   res.send('我是get');
}).post((req, res)=>{
  res.send('我是post');
});

//应用中间件
app.use("/home",homeRouter);

//错误中间件

// app.use((req,res,next)=>{
//   console.log('发生了错误');
//   res.status(404).send('丢了');
// });

app.listen(8000,function(){
  console.log('running');
});