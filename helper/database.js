require('dotenv').config(); // Load environment variables
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) =>{
    MongoClient.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.uv6ds.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`)
    .then(clinet=>{
        console.log('Connected to MongoDB!');
        _db=clinet.db();
        cb();
    })
    .catch(error=>{
        console.error(error);
        next(error);
    });
}

const getDB= () =>{
    if(_db){
        return _db;
    }
    throw 'No database found!';
}

exports.mongoConnect = mongoConnect;

exports.getDB = getDB;
