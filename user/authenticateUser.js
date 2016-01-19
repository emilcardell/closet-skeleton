    "use strict";
    const logger = require('../utils/logger.js');
    const iz = require('iz');
    const mongoDb = require('../utils/mongoConnection.js');
    const uuid = require('uuid');
    const sendEmail = require('../utils/sendEmail.js')

    module.exports = function(app) {
        app.get('/listUsers', (req, resp) => {
            let db = mongoDb('users');

            db.users.find()
            .then(function(docs) {
                resp.json(docs);
            });

        });
        app.get('/delUsers', (req, resp) => {
            let db = mongoDb('users');

            db.users.remove();
            resp.json({message: 'delete'});
        });

        app.get('/authenticateUser/:authtid', (req, resp) => {
            resp.render('authenticateUser', {});
        });

        app.get('/api/user/createUser/:authtid', (req, resp) => {
            let db = mongoDb('users');
            db.users.find({ authId: req.params.authtid, isAuthenticated: false, isDeleted: false })
            .then(function(doc) {
                if (doc.length === 0) {
                    resp.status(404).end();
                }

                resp.status(200).end();
            });
        });

        app.post('/api/user/createUser', (req, resp) => {
            let db = mongoDb('users');

            db.users.findAndModify({
                query: { authId: req.params.authtid, isAuthenticated: false, isDeleted: false },
                update: { $set: { isAuthenticated: true, authenticated: new Date() } },
                new: false
            })
            .then(function(doc) {
                if (doc.value) {
                    resp.json({ doc: doc, authId: req.params.authtid });
                    //Show thank you go to login.
                } else {
                    resp.json({ doc: doc, authId: req.params.authtid });
                    //Show no user found
                }
            });

        });
    };
