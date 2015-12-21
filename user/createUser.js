"use strict";
// Only validate email and password.
// bcryp password
// add extra fields
// authentisera e-mail
const validationSummarizer = require('./utils/validationSummarizer.js');
const logger = require('./utils/logger.js');
const bcrypt = require('bcrypt-nodejs');
const iz = require('iz');
const mongoDb = require('./utils/mongoConnection.js');
const shortid = require('shortid');

const saltRounds = 1000;

module.exports = function(app) {

    app.post('/api/user/createUser', (req, resp) => {
        let createUserRequest = req.body;
        let requestValidationResult = { errors: [], valid: true };

        requestValidationResult = validationSummarizer(requestValidationResult, iz(createUserRequest.email).required().email());
        requestValidationResult = validationSummarizer(requestValidationResult, iz(createUserRequest.password).required().minLength(6).maxLength(1024));

        if (!requestValidationResult.valid) {
            logger.info(requestValidationResult.error);
            resp.json(requestValidationResult.errors).sendStatus(400);
            return;
        }

        let emailKey = createUserRequest.email.toLowerCase();

        let db = mongoDb('users');
        db.users.findOne({
            emailKey: emailKey
        }).then(function(doc) {
            if (doc) {

                if ( doc.isAuthenticated ) {
                    resp.json( { errorMessage: 'User already exist' } ).sendStatus(409);
                    logger.info(`User with e-mail ${emailKey} already exist`);
                    return;
                }

                //Resend e-mail.
            }

            let salt = bcrypt.genSaltSync(saltRounds);
            let newUser = {
                emailKey: emailKey,
                email: createUserRequest.email,
                passwordHash: bcrypt.hashSync(newUser.password, salt),
                created: new Date(),
                isAuthenticated: false,
                isAdmin: false,
                authId: shortid.generate()
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
