const controllers = require('../controllers/user')

routes=[
    {
        method: 'GET',
        path: '/',
        options: {
            auth: false
        },
        handler:controllers.getLogin
    },
    {
        method: 'GET',
        path: '/report-builder',
        options: {
            auth: false
        },
        handler:controllers.getReportBuilder
    },
    {
        method: 'POST',
        path: '/report-data-upload',
        options: {
            auth: false,
            payload:{
                parse: true,
                multipart: {
                    output: 'stream'
                },
            }
        },
        handler:controllers.postDataToGenerateReport
    },
    
    {
        method: 'GET',
        path: '/create_account',
        options: {
            auth: false
        },
        handler:controllers.getCreateAccount
    },
    {
        method: 'POST',
        path: '/create_account',
        options: {
            auth: false
        },
        handler:controllers.postCreateAccount
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
        path:'/logout',
        options: {
            auth: {
                mode: 'try'
            }
        },
        handler: controllers.logout
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
    },
    {
        method: 'POST',
        path: '/add_number',
        handler:controllers.addNumberOrEmail
    },
    {
        method: 'POST',
        path: '/add_email',
        handler:controllers.addNumberOrEmail
    },
    {
        method:'DELETE',
        path:"/delete_all_contacts",
        handler:controllers.deleteAllContacts
    }

]
module.exports=routes