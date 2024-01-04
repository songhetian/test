const fs = require("fs");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./../../config.env'});
const port = process.env.NODE_PORT;
const Tour = require("./../../models/tourModel");

const conn = mongoose.connect(process.env.DATABASE,{
  useCreateIndex : true,
  useNewUrlParser : true,
  useFindAndModify : false,
  useUnifiedTopology: true
}).then(conn => {
  console.log("Connect success");
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));
const importDate = async () => {
  try{
      await Tour.create(tours);
      console.log("import success");
  }catch(err){
    console.log(err);
  }

  process.exit();
}
const deleteDate = async () => {
  try{
      await Tour.deleteMany();
      console.log("delete success");
  }catch(err){
    console.log(err);
  }
  process.exit();
}

if(process.argv[2] === "--import") {
  importDate();
}else if(process.argv[2] === "--delete"){
  deleteDate();
}

console.log(process.argv);



