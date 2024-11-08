const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  const customErr = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, 
    message: err.message || 'There is something wrong with the code', 
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if ( err.code && err.code === 11000){
    customErr.message = `Duplicate Error on ${Object.keys(err.keyValue)} field`
    customErr.statusCode = 400;
  }

  if ( err.errors && err.name === 'ValidationError'){
    const t = Object.values(err.errors).map((item) => item.message).join(', ');
    customErr.message = t;
    customErr.statusCode = 400;
  }

  if ( err.name && err.name === 'CastError'){
    customErr.message = `No item found with the value of ${err.value}`;
    customErr.statusCode = 404;
  }
  
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customErr.statusCode).json({msg: customErr.message});
}

module.exports = errorHandlerMiddleware
