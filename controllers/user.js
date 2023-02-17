const User = require('../models/user')

exports.getLogin =(request, h)=> {
    return h.view('login');
};


exports.postLogin = async (req,h ) => {
    const { username, password } = req.payload;
    return User.findByUsernameAndPassword(username,password)
        .then((res) =>{
            return h.redirect('/login');
    }).catch(()=>{
        return h.redirect('/login');
    })
}