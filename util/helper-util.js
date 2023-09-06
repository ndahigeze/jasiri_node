

exports.getInfo = (contact)=>{
   return {
      'emails': this.getEmails(contact),
      'phones': this.getPhones(contact)
   }
}

exports.getEmails =(contact)=>{
    return contact.emails
}

exports.getPhones =(contact)=>{
    return contact.contact_numbers
}



