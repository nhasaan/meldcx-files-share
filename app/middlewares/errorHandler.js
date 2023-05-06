const AppError = require('../utils/app-error');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    status_code: err.statusCode,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  console.error('ERROR:', err);
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      status_code: err.bodyStatusCode,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR:', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'FAIL',
      status_code: 500,
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'FAIL';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    sendErrorProd(error, res);
  }
};
