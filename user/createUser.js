"use strict";
// Only validate email and password.
// bcryp password
// add extra fields
// authentisera e-mail
const validationSummarizer = require('./utils/validationSummarizer.js');
const logger = require('./utils/logger.js');
const bcrypt = require('bcrypt-nodejs');
const iz = require('iz');

const saltRounds = 1000;

module.exports = function(app) {
    app.post('/api/user/createUser', (req, resp) => {
        let createUserRequest = req.body;
        let requestValidationResult = { errors: [], valid: true };
        let newUser = {};

        requestValidationResult = validationSummarizer(requestValidationResult, iz(createUserRequest.email).required().email());
        requestValidationResult = validationSummarizer(requestValidationResult, iz(createUserRequest.password).required().minLength(6).maxLength(1024));

        let salt = bcrypt.genSaltSync(saltRounds);
        newUser.passwordHash = bcrypt.hashSync(newUser.password, salt);

    });
};
