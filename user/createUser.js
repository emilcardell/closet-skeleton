"use strict";
const logger = require('../utils/logger.js');
const iz = require('iz');
const mongoDb = require('../utils/mongoConnection.js');
const uuid = require('uuid');
const sendEmail = require('../utils/sendEmail.js');
const config = require('../config.js');

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
                    resp.json( { errorMessage: 'User already exist' } ).status(409).end();
                    logger.info(`User with e-mail ${emailKey} already exist`);
                    return;
                }
                //Resend e-mail.
                resp.json({}).status(200).end();
                return;
            }
            let newUser = {
                emailKey: emailKey,
                email: createUserRequest.email,
                accountType: createUserRequest.accountType,
                isAuthenticated: false,
                isAdmin: false,
                isDeleted: false,
                created: new Date(),
                emailAuthId: uuid.v4()
            };
            config.adminEmails.forEach((email) => {
                if (newUser.emailKey === email) {
                    newUser.isAdmin = true;
                }
            });
            db.users.save(newUser);

            sendEmail.sendEmail({
                to: newUser.email,
                subject: 'Authenticate user',
                template: 'authenticateUser',
                context: { url: config.hostUrl + '/authenticateUser/' + newUser.emailAuthId }
            });

            resp.json({}).status(200).end();

        });
    });
};
