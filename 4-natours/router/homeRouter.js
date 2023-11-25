const express = require('express');
const router= express.Router();

router.get('/path1',(req, res,next) =>{
    console.log("path1");
    res.send("path1");
    next();
});
router.get('/path2',(req, res,next) =>{
  console.log("path2");
  res.send("path2");
  next();
});

router.get('/user/:id',(req, res, next) =>{
    console.log(req.params);
    console.log(req.query);
    res.send("user");
    next();
});
router.post('/user',(req, res, next) =>{
  console.log(req.body);
  console.log(req.query);
  res.send("user");
 // next();
});

module.exports = router;