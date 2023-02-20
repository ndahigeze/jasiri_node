const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

class Contact {
    constructor(first_name,last_name,id,userId,emails=[],contact_numbers=[]){
        this.first_name=first_name;
        this.last_name=last_name;
        this._id= id ? new mongodb.ObjectId(id):null
        this.userId= userId
        this.emails=emails;
        this.contact_numbers=contact_numbers;
    }
    save(){

        const db = getDb();
        let dbOp;
        if(this._id){
            let updated
            dbOp=db.collection("contacts")
                .updateOne(
                    {'_id': this._id},
                    {$set:this.makeUpdatedObject(this)}
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
    makeUpdatedObject(obj){
        let updatedObject={
            first_name:obj.first_name,
            last_name:obj.last_name,
        }
        if(obj.emails.length>0){
            updatedObject.emails=obj.emails
        }
        if(obj.contact_numbers.length>0){
            updatedObject.contact_numbers=obj.contact_numbers
        }
        return updatedObject
    }
    static  fetchAll(userId){
        const db = getDb();
        return db.collection('contacts')
            .find({userId:userId})
            .toArray()
            .then(contacts =>{
                return contacts
            })
            .catch(err=>console.log(err))
    }

    static getUserContacts(userId,search_string){
        const db = getDb();
        let query={userId:userId}
        if(search_string?.length>0){
           query={userId:userId,$or:[{first_name:search_string},{last_name:search_string}]}
        }
        return db.collection('contacts')
            .find(query)
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
            .catch(err=>{return err})
    }

    static deleteById(id){
        const db=getDb();
        return db.collection('contacts')
            .deleteOne({'_id': new mongodb.ObjectId(id)})
            .then((res)=>{
                return res
            })
            .catch(err=> {return err})
    }

    static  deleteByIds(ids){
        const db=getDb();
        return db.collection('contacts')
            .deleteMany({'_id': {$in:ids}})
            .then((res)=>{
                return res
            })
            .catch(err=>{return err})
    }



    static getDuplicate(userId){
        let all=[]
        let duplicate_index=[]
        return this.fetchAll(userId)
            .then(res=>{
                let temp=res
                res.forEach((el)=>{
                      let filtered=temp.filter((item,ind)=>{
                          if(
                              (item.first_name.toLowerCase()===el.first_name.toLowerCase() && item.last_name.toLowerCase()===el.last_name.toLowerCase())||
                              (item.last_name.toLowerCase()===el.first_name.toLowerCase() && item.first_name.toLowerCase()===el.last_name.toLowerCase())
                          ){
                              duplicate_index.push(ind)
                            return true
                          }
                      })

                    temp=temp.filter((item,idx)=>{
                        if(!duplicate_index.includes(idx)){
                            return true
                        }
                    })
                    duplicate_index=[]
                      if(filtered.length>1){
                          all.push(filtered)
                      }
                })
                return all
            }).catch(err=>console.log(err))
    }
}
module.exports = Contact;