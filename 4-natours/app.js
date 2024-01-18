const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();
const tourRouter = require('./router/tourRouter');
const authRouter = require('./router/authRouter');

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}


app.use('/api/v1/tours', tourRouter);
//用户
app.use('/api/v1/user',authRouter);
//静态文件
app.use(express.static(`${__dirname}/public`));

//错误处理
app.all('*',(req,res,next) => {
    const err = new AppError(`这个${req.originalUrl} 不存在`,404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;
