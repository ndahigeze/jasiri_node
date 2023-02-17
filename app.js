'use strict';
const Vision = require('@hapi/vision');
const Bcrypt = require('bcrypt');
const Hapi = require('@hapi/hapi');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user')
const HapiAuthCookie = require('hapi-auth-cookie');
const Path = require('path');
const Ejs = require('ejs');
const routes=require('./routes/user')
const Inert = require('@hapi/inert');

const users = [
    {
        username: 'john',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    }
];
const server = Hapi.server({port: 4000 });

const start = async () => {



    await server.register(HapiAuthCookie);
    await server.register(Vision);
    await server.register(Inert);
    server.views({
        engines: { ejs: Ejs },
        relativeTo: __dirname,
        path: 'templates'
    });

    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: 'sid-example',
            password: '!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6',
            isSecure: false
        },
        redirectTo: '/login',
        validateFunc: async (request, session) => {

            const account = await users.find(
                (user) => (user.id === session.id)
            );

            if (!account) {

                return { valid: false };
            }

            return { valid: true, credentials: account };
        }
    });

    server.auth.default('session');

    server.route([
        {
            method: 'GET',
            path: '/public/{param*}',
            options: {
                auth: false
            },
            handler: {
                directory: {
                    path: Path.join(__dirname, 'public')
                }
            }
        },
        ...routes
    ]);

    await server.start();

};


mongoConnect(()=>{
    start()
})