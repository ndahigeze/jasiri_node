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
            auth: {
                mode: 'try'
            }
        },
        handler: controllers.postLogin
    },
    {
        method: 'GET',
        path:'/contacts',
        handler: controllers.getContactsPage
    },

    {
        method: 'GET',
        path:'/search_contacts',
        handler: controllers.getAllContacts
    },
    {
        method: 'POST',
        path:'/create_contact',
        handler:controllers.createContact
    },
    {
        method: 'PUT',
        path: '/update_contact',
        handler:controllers.updateContact
    },
    {
        method: 'DELETE',
        path:'/delete_contact/{id}',
        handler:controllers.deleteContact
    },

    {
        method: 'GET',
        path: '/get_duplicates',
        handler:controllers.getDuplicates
    },
    {
        method: 'PUT',
        path: '/merge_duplicate',
        handler:controllers.mergeDuplicate
    }

]
module.exports=routes