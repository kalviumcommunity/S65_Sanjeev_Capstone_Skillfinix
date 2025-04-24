const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        msg: 'Validation error', 
        errors: err.errors 
      });
    }
  
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        msg: 'Invalid ID format' 
      });
    }
  
    res.status(500).json({ 
      success: false, 
      msg: 'Something went wrong on the server' 
    });
  };
  
  module.exports = errorHandler;