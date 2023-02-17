const controllers = require('../controllers/user')

routes=[
    {
        method: 'GET',
        path: '/login',
        options: {
            auth: false
        },
        handler:controllers.getLogin
    },
    {
        method: 'POST',
        path:'/login',
        options: {
            auth: false
        },
        handler: controllers.postLogin
    }
]
module.exports=routes