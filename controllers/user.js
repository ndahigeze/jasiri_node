const User = require('../models/user')
const Contact = require('../models/contact')
const mongodb = require('mongodb')
const crypto = require('crypto');
require("dotenv").config();
const salt =process.env.SESSION_PASSWORD
exports.getLogin =(request, h)=> {
    return h.view('login');
};


exports.postLogin = async (req,h ) => {
    const { username, password } = req.payload;
    const hash = crypto.pbkdf2Sync(password, salt,
        1000, 64, `sha512`).toString(`hex`)
    console.log(hash)
    return User.findByUsernameAndPassword(username,hash)
        .then((res) =>{
            if(res){
                req.cookieAuth.set({username:res.username, _id:res._id});
                return {success:true}
            }  else{
                return {wrong_credentials:true}
            }
    }).catch((err)=>{
        return {error:true}
    })
}

exports.getCreateAccount = (req,h)=>{
    return h.view('sign_up');
}

exports.postCreateAccount = (req,h)=>{
    const payload=req.payload
    const hash = crypto.pbkdf2Sync(payload.password, salt,
        1000, 64, `sha512`).toString(`hex`)

    let user=new User(payload.username,hash,null)
    return User.findByUsername(payload.username)
        .then(res=>{
            if(res){
                return {res:res,exist:true}
            }else{
                return user.save()
                    .then(res=>{
                        return {created:true}
                    })
                    .catch(err=>{
                        return {error:true}
                    })
            }
    }).then(res=>{
        if(res.exist){
            return {exist:true}
        }else{
            return {success:true};
        }

    }).catch(err=>{
        return h.redirect('/create_account');
    })



}

exports.logout = (req,h)=>{
    req.cookieAuth.set({username:'Anonymous', _id:'Anonymous'});
    return h.redirect('/');
}


exports.getContactsPage = async (req,h ) =>{
    return h.view('user_contacts');
}

exports.getAllContacts = async (req,h)=>{
    return Contact.getUserContacts(req.state.sid._id,req.query.search_string)
        .then((res) =>{
           return res
        }).catch((err)=>{
              console.log(err)
        })
}

exports.createContact = async  (req,h)=>{
    const contact=req.payload
    let new_contact = new Contact(
         contact.first_name,
        contact.last_name,
        null,
        req.state.sid._id
    )
    return new_contact
        .save()
        .then(res=>{
            return "success"
        }).catch(err=> {
            return 'errod occured'
        })
}

exports.updateContact = async  (req,h)=>{
    const contact=req.payload
    let new_contact = new Contact(
        contact.first_name,
        contact.last_name,
        contact._id,
        req.state.sid._id
    )
    return new_contact
        .save()
        .then(res=>{
            return "success"
        }).catch(err=> {
            return 'errod occured'
        })
}

exports.deleteContact = (req,h)=>{
    return Contact.deleteById(req.params.id)
        .then(res=>{
            return "success"
        }).catch(err=>{
            return "Error occured"
    })
}

exports.getDuplicates = (req,h)=>{
    return Contact.getDuplicate(req.state.sid._id)
        .then(res=>{
            return res
        }).catch(err=>{
            return "Error"
        })
}

exports.mergeDuplicate = (req,h)=>{
    const duplicates=req.payload
    const contact={
        first_name:'',
        last_name:'',
        emails:[],
        contact_numbers:[]
    }
    let duplicateIdObjs=[]

     duplicates.forEach(el=>{
        contact.emails.push(...el.emails)
        contact.contact_numbers.push(...el.contact_numbers)
        duplicateIdObjs.push(new mongodb.ObjectId(el._id))
    })

    return Contact
        .deleteByIds(duplicateIdObjs)
        .then(()=>{
            let merged_contact=new Contact(
                duplicates[0].last_name,
                duplicates[0].first_name,
                null,
                req.state.sid._id,
                contact.emails,
                contact.contact_numbers
            )

            return merged_contact.save()
            .then(res=>{
                return "success"
            }).catch(err=>{
                return "Error"
            })

        })
        .then(res=>{
            return "success"
        }).catch(err=>{
            return err
        })

}


exports.addNumberOrEmail=(req,h)=>{
    const contact=req.payload
    let new_contact = new Contact(
        contact.first_name,
        contact.last_name,
        contact._id,
        req.state.sid._id,
        req.payload.emails,
        req.payload.contact_numbers
    )
    return new_contact
        .save()
        .then(res=>{
            return "success"
        }).catch(err=> {
            return 'errod occured'
        })
}
