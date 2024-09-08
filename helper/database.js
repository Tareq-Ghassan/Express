require('dotenv').config(); // Load environment variables
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) =>{
    MongoClient.connect(process.env.MONGO_URI)
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
