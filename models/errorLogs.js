const getDB = require('../helper/database').getDB;


class ErrorLog{
    constructor({errorStack,timestamp}){
        this.errorStack = errorStack;
        this.timestamp  = timestamp
    }
    // Revised static method to accept error details
    static log(errorDetails) {
        const db = getDB();
        return db.collection('errorLogs')
        .insertOne(errorDetails) // Insert the passed error details
        .then(result => {
            console.log('Logged error to database:', result);
        }).catch(err => {
            console.log('Failed to log error to database:', err);
        });
    }

} 

module.exports = ErrorLog;