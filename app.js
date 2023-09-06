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
const morgan = require('morgan')
const fs = require('fs'); // Node.js File System module

require("dotenv").config();

const onRequestStream = fs.createWriteStream('on_request.log', { flags: 'a' });
const onPreresponce = fs.createWriteStream('on_pre_responce.log', { flags: 'a' });
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

    server.ext('onRequest', (request, h) => {
        morgan.token('json', (req,h) => {
        
            return JSON.stringify({
                url: req.url,
                method: req.method,
                httpVersion: req.httpVersion,
                headers:req.headers,
                status:req.statusCode,
            })
        });
    
        morgan(':json', {
            stream: onRequestStream
        })(request.raw.req, request.raw.res, () => {});
    
        return h.continue;
    });

    
    server.ext('onPreResponse', (request, h) => {
        morgan.token('json', (req,h) => {
        
            return JSON.stringify({
                url: h.url,
                method: h.method,
                httpVersion: h.httpVersion,
                headers:h._header,
                status:h.statusCode,
            })
        });    

        morgan(':json', {
            stream: onPreresponce
        })(request.raw.req, request.raw.res, () => {});
    
        return h.continue;
    });
    

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