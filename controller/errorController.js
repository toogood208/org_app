import dotenv from 'dotenv';
dotenv.config({ path: `${process.cwd()}/.env` });
import AppError  from "../util/appError.js"; 

const sendErrorDev = (error, response) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  console.log(error);

  response.status(statusCode).json({
    errors: error.errors.length > 0 ? error.errors : [{
      status,
      message,
      stack,
    }],
  });
};

const sendErrorProd = (error, response) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;

  if (error.isOperational) {
    return response.status(statusCode).json({
      errors: error.errors.length > 0 ? error.errors : [{
        status,
        message: message,
      }],
    });
  }

  console.log(error.name, error.message, error.stack);

  return response.status(statusCode).json({
    errors: [{
      status,
      message: 'Something went wrong!',
    }],
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (err.name === 'SequelizeDatabaseError') {
    err = new AppError(err.message, 422);
  }
  if (err.name === 'SequelizeEagerLoadingError') {
    err = new AppError('Eager loading error: Specify the association alias using "as".', 422, []);
  }
  
  if (err.name === 'JsonWebTokenError') {
    err = new AppError('unathorized', 401);
  }
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }));
    err = new AppError('Validation error', 422, errors);
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }));
    err = new AppError('Unique constraint error', 422, errors);
  }

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res);
  }
  sendErrorProd(err, res);
};

export default globalErrorHandler; // Using default export
