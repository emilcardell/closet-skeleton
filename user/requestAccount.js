"use strict";
const logger = require('../utils/logger.js');
const iz = require('iz');
const are = iz.are;
const mongoDb = require('../utils/mongoConnection.js');
const uuid = require('uuid');
const sendEmail = require('../utils/sendEmail.js');
const config = require('../config.js');

const requestAccountRules = {
    'email': [
        {
            'rule': 'required',
            'error': 'Not E-mail authentication id supplied.'
        },
        {
            'rule': 'email',
            'error': 'A valid e-mail is not supplied.'
        }
    ],
    'accountType': [
        {
            'rule': 'required',
            'error': 'Not account type is supplied.'
        }
    ]
};

module.exports = function(app) {

    app.get('/', (req, resp) => {
        resp.render('requestAccount');
    });

    app.post('/api/account/requestAccount', (req, resp) => {
        let createAccountRequest = req.body;

        let areRules = are(requestAccountRules);

        if (!areRules.validFor(createAccountRequest)) {
            let logErrors = areRules.getInvalidFields();
            logger.warn(logErrors, 'authentication validation error');
            resp.status(400).json(logErrors).end();
            return;
        }

        let db = mongoDb('accountRequests');

        let newAccountRequest = {
            email: createAccountRequest.email,
            accountType: createAccountRequest.accountType,
            created: new Date(),
            emailAuthId: uuid.v4(),
            hasCreatedAccount: false
        };

        db.accountRequests.save(newAccountRequest);

        sendEmail.sendEmail({
            to: newAccountRequest.email,
            subject: 'Authenticate user',
            template: 'authenticateUser',
            context: { url: config.hostUrl + '/createOrganisation/' + newAccountRequest.emailAuthId }
        });

        resp.status(200).end();

    });
};
