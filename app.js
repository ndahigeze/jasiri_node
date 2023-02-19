'use strict';
const Vision = require('@hapi/vision');
const Hapi = require('@hapi/hapi');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user')
const HapiAuthCookie = require('hapi-auth-cookie');
const Path = require('path');
const Ejs = require('ejs');
const routes=require('./routes/user')
const Inert = require('@hapi/inert');
require("dotenv").config();


const server = Hapi.server({port: process.env.PORT });

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
            name: 'sid',
            password:process.env.SESSION_PASSWORD,
            isSecure: false
        },
        redirectTo: '/',
        validateFunc: async (request, session) => {
            return User.findById(session._id)
                .then(user=>{
                    if (!user) {

                        return { valid: false };
                    }
                    return { valid: true, credentials: user };
                }).catch(err=>{
                    console.log(err)
                    return { valid: false };
                })
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