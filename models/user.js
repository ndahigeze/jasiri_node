const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId;


class User{
    constructor(username, password,id) {
        this.username = username
        this.password = password
        this._id= id ? new mongodb.ObjectId(id):null
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this)
            .then()
    }



    static findById(userId){
        const db = getDb();
        return db.collection('users')
            .findOne({_id:new ObjectId(userId)})
            .then(user=>{
                return user;
            }).catch(err=>console.log(userId))

    }

    static findByUsername(username){
        const db = getDb();
        return db.collection('users')
            .findOne({username:username})
            .then(user=>{
                return user;
            }).catch(err=>console.log(userId))

    }

    static findByUsernameAndPassword(username,password){
        const db = getDb();
        return db.collection('users')
            .findOne({username:username,password:password})
            .then(user=>{
                return user;
            }).catch(err=>console.log(err))
    }
}

module.exports = User;