const sendErrorDev = (err , res ) => {
  res.status(err.statusCode).json({
    status : err.statusCode,
    error : err.message,
    err   : err,
    stack : err.stack
  });
}

const sendErrorProd = (err , res) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status : err.statusCode,
        error : err.message,
        err   : err,
        stack : err.stack
      });
    }else{
      res.status(err.statusCode).json({
        status : "error",
        message : "出现错误"
      });
    }
}



module.exports = (err,req,res,next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV !== 'production') {
    sendErrorDev(err,res);
  }else{
    sendErrorProd(err,res);
  }
}