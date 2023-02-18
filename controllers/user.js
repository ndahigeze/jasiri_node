const User = require('../models/user')
const Contact = require('../models/contact')
const mongodb = require('mongodb')

exports.getLogin =(request, h)=> {
    return h.view('login');
};


exports.postLogin = async (req,h ) => {
    const { username, password } = req.payload;
    return User.findByUsernameAndPassword(username,password)
        .then((res) =>{
            req.cookieAuth.set({username:res.username, _id:res._id});
            return h.redirect('/contacts');
    }).catch((err)=>{
        console.log(err)
        return h.redirect('/login');
    })
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
    return Contact.getDuplicate()
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
