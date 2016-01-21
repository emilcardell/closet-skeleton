"use strict";
const logger = require('../utils/logger.js');
const iz = require('iz');
const are = iz.are;
const mongoDb = require('../utils/mongoConnection.js');
const bcrypt = require('bcrypt-nodejs');
const saltRounds = 1000;

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
        resp.json({ message: 'delete' });
    });

    app.get('/authenticateUser/:authtid', (req, resp) => {
        resp.render('authenticateUser', {});
    });

    app.get('/api/user/authenticateUser/:authtid', (req, resp) => {
        let db = mongoDb('users');
        db.users.find({ authId: req.params.authtid, isAuthenticated: false, isDeleted: false })
        .then(function(doc) {
            if (doc.length === 0) {
                resp.status(404).end();
            }
            resp.status(200).end();
        });
    });

    app.post('/api/user/authenticateUser', (req, resp) => {
        let createUserRequest = req.body;

        let authenticateUserRules = {
            'authId': [
                {
                    'rule': 'required',
                    'error': 'Not authId supplied.'
                }
            ],
            'fullName': [
                {
                    'rule': 'required',
                    'error': 'You must enter your name.'
                }
            ],
            'password': [
                {
                    'rule': 'required',
                    'error': 'A password is requered to get access.'
                },
                {
                    'rule': 'minLength',
                    'args': [6],
                    'error': 'Password must be between 6 and 1000 characters.'
                },
                {
                    'rule': 'maxLength',
                    'args': [1024],
                    'error': 'Password must be between 6 and 1000 characters.'
                }
            ]
        };

        let areRules = are(authenticateUserRules);

        if (!areRules.validFor(createUserRequest)) {
            let logErrors = areRules.getInvalidFields();
            logger.warn(logErrors, 'authentication validation error');
            resp.status(400).json(logErrors).end();
            return;
        }

        let db = mongoDb('users');

        let salt = bcrypt.genSaltSync(saltRounds);
        let passwordHash = bcrypt.hashSync(createUserRequest.password, salt);
        console.log( { isAuthenticated: true, authenticated: new Date(), fullName: createUserRequest.fullName, passwordHash: passwordHash });
        db.users.findAndModify({
            query: { authId: createUserRequest.authId, isAuthenticated: false, isDeleted: false },
            update: { $set: { isAuthenticated: true, authenticated: new Date(), fullName: createUserRequest.fullName, passwordHash: passwordHash } },
            new: false
        })
        .then(function(doc) {
            if (doc.value) {
                resp.status(200).end();
            } else {
                resp.json({ doc: doc, authId: req.params.authtid }).status(500).end();
            }
        });

    });
};
