const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

class Contact {
    constructor(first_name,last_name,id,userId){
        this.first_name=title;
        this.last_name=price;
        this._id= id ? new mongodb.ObjectId(id):null
        this.userId= userId
        this.emails=[];
        this.contact_numbers=[];
    }
    save(){
        const db = getDb();
        let dbOp;
        if(this._id){
            dbOp=db.collection("contacts")
                .updateOne(
                    {'_id': this._id},
                    {$set:this}
                )
        }else{
            dbOp=db.collection('contacts').insertOne(this)
        }

        return dbOp
            .then(result=>{
                console.log(result)
            })
            .catch(err=>console.log(err));
    }
    static  fetchAll(){
        const db = getDb();
        return db.collection('contacts')
            .find()
            .toArray()
            .then(contacts =>{
                return contacts
            })
            .catch(err=>console.log(err))
    }

    static findById(contactId){
        const db = getDb();
        return db.collection('products')
            .find({'_id': new mongodb.ObjectId(productId)})
            .next()
            .then(contact=>{
                return contact;
            })
            .catch(err=>console.log(err))
    }

    static deleteById(id){
        const db=getDb();
        return db.collection('contacts')
            .deleteOne({'_id': new mongodb.ObjectId(id)})
            .then(()=>{
                console.log("deleted")
            })
            .catch(err=>console.log(err))
    }
}
module.exports = Contact;