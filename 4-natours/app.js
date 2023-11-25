const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./router/tourRouter');

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/user', userRouter);
//静态文件
app.use(express.static(`${__dirname}/public`));
userRouter.get('/:id', function(req, res) {
  res.send('user');
});

module.exports = app;
