const app = require('./app');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const port = process.env.NODE_PORT;

const conn = mongoose.connect(process.env.DATABASE,{
  useCreateIndex : true,
  useNewUrlParser : true,
  useFindAndModify : false
}).then(conn => {
  console.log("Connect success");
});

//1.创建骨架
const tourSchema = new mongoose.Schema({
  name : {
    type : String,
    required : [true,"行程必须有名字"]
  },
  rating : {
    type : Number,
    default : 4.5
  },
  price : {
    type : Number,
    required : [true,"行程必须有价格"]
  }
});
//2.创建模型
const Tour = mongoose.model('Tour',tourSchema);

const TourTest = new Tour({
  name : "游玩",
  price : 100,
  rating : 4.8
});

TourTest.save().then(doc => {
  console.log(doc);
}).catch(err => {
  console.log(err.message);
});

app.listen(port,() => {
  console.log("express running");
});