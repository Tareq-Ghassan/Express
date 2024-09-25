const ErrorLog = require('../models/errorLogs');

// Error handling middleware for 404 errors
exports.get404 = (req, res, next) => {
    res.status(404).render('404',{
        path: '/404',
        pageTitle: 'Page Not Found',
        
    });
}

// Error handling middleware for 500 errors
exports.handle500 = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    new ErrorLog({
        errorStack: err.stack,
        timestamp: new Date()
    })
    .save()
    .then(() => {
            console.log('Error logged to database');
         })
    .catch(error =>{
            console.error('Failed to log error to database:', error);
        });
    
    res.status(500).render('500', { 
        pageTitle: 'Server Error', 
        path: '/500',
    });
};