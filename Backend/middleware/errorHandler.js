const errorHandler = (err, req, res, next) => {
    // If the error has a statusCode (from AppError), use it; otherwise 500
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        status: 'error',
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;