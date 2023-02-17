require("dotenv").config();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbURI =process.env.DATABASE_URL;
let _db;
const mongoConnect = (callback) =>{
    MongoClient.connect(dbURI,{useNewUrlParser: true, useUnifiedTopology: true})
        .then((client)=>{
            _db=client.db()
            callback()
        })
        .catch((err)=>console.log(err));
};

const getDb = () =>{
    if(_db){
        return _db;
    }
    throw  'No Database found'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
