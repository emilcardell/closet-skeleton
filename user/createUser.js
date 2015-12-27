"use strict";
// Only validate email and password.
// bcryp password
// add extra fields
// authentisera e-mail
const logger = require('./utils/logger.js');
const iz = require('iz');
const mongoDb = require('./utils/mongoConnection.js');
const uuid = require('uuid');

module.exports = function(app) {

    app.post('/api/user/createUser', (req, resp) => {
        let createUserRequest = req.body;

        let requestValidationResult = iz(createUserRequest.email).required().email();

        if (!requestValidationResult.valid) {
            logger.info(requestValidationResult.error);
            resp.json(requestValidationResult.errors).sendStatus(400);
            return;
        }

        let emailKey = createUserRequest.email.toLowerCase();

        let db = mongoDb('users');
        db.users.findOne({
            emailKey: emailKey
        }).then(function(user) {
            if (user) {

                if ( user.isAuthenticated ) {
                    resp.json( { errorMessage: 'User already exist' } ).sendStatus(409);
                    logger.info(`User with e-mail ${emailKey} already exist`);
                    return;
                }

                //Resend e-mail.
            }

            let newUser = {
                emailKey: emailKey,
                email: createUserRequest.email,
                accountType: createUserRequest.accountType,
                isAuthenticated: false,
                isAdmin: false,
                authId: uuid.v4()
            };

            db.users.save(newUser);
            //send e-mail

        });
    });

/*
    app.post('/someUrl', () =>{

        db.mycollection.findAndModify({
        	query: { name: 'mathias' },
        	update: { $set: { tag:'maintainer' } },
        	new: true
        })
        .then(function(doc) {
        	// doc.tag === 'maintainer'
        });
    } )*/
};
