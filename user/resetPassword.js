"use strict";
const logger = require('../utils/logger.js');
const mongoDb = require('../utils/mongoConnection.js');
const uuid = require('uuid');
const bcrypt = require('bcrypt-nodejs');
const config = require('../config.js');
const moment = require('moment');
const iz = require('iz');
const are = iz.are;
const sendEmail = require('../utils/sendEmail.js');

const resetPasswordRules = {
    'email': [
        {
            'rule': 'email',
            'error': 'You have to enter a valid e-mail address.'
        },
        {
            'rule': 'required',
            'error': 'You must specify an e-mail adrress.'
        }
    ]
};

module.exports = function(app) {
    app.get('/resetPassword', (req, resp) => {
        resp.render('resetPassword');
    });

    app.get('/resetChangePassword/:resetid', (req, resp) => {
        resp.render('resetChangePassword');
    });

    app.post('/api/user/requestResetPassword', (req, resp) => {
        let resetPasswordRequest = req.body;

        let areRules = are(resetPasswordRules);

        if (!areRules.validFor(resetPasswordRequest)) {
            let logErrors = areRules.getInvalidFields();
            logger.warn(logErrors, 'resetPassword validation error');
            resp.status(400).json(logErrors).end();
            return;
        }


        let resetPasswordInfo = {
            id: uuid.v4(),
            expires: moment().add(24, 'hours').toString()
        };

        let db = mongoDb('users');
        db.users.findAndModify({
            query: { emailKey: resetPasswordRequest.email.toLowerCase(), isAuthenticated: true, isDeleted: false },
            update: { $set: { resetPassword: resetPasswordInfo } },
            new: false
        })
        .then(function(doc) {
            if (doc.value) {
                sendEmail.sendEmail({
                    to: doc.email,
                    subject: 'Password reset',
                    template: 'resetPassword',
                    context: { url: config.hostUrl + '/resetChangePassword/' + resetPasswordInfo.id }
                });

                resp.status(200).end();
            } else {
                resp.status(404).json({ emailEMail: req.params.email }).end();
            }
        });
    });

    app.get('/api/user/resetPassword/:resetid', (req, resp) => {
        let db = mongoDb('users');
        db.users.find({ "resetPassword.id": req.params.resetid, isAuthenticated: false, isDeleted: false })
        .then(function(doc) {
            if (doc.length === 0) {
                resp.status(404).end();
            }
            resp.status(200).end();
        });
    });

    const resetChangePasswordRules = {
        'resetid': [
            {
                'rule': 'required',
                'error': 'Reset id not supplied.'
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
    const saltRounds = 1000;

    app.post('/api/user/resetPassword', (req, resp) => {
        let resetPasswordRequest = req.body;

        let areRules = are(resetChangePasswordRules);

        if (!areRules.validFor(resetPasswordRequest)) {
            let logErrors = areRules.getInvalidFields();
            logger.warn(logErrors, 'authentication validation error');
            resp.status(400).json(logErrors).end();
            return;
        }

        let salt = bcrypt.genSaltSync(saltRounds);
        let passwordHash = bcrypt.hashSync(resetPasswordRequest.password, salt);

        let db = mongoDb('users');
        db.users.findAndModify({
            query: { "resetPassword.id": resetPasswordRequest.email.toLowerCase(), isAuthenticated: true, isDeleted: false },
            update: { $set: { resetPassword: null, passwordHash: passwordHash } },
            new: false
        })
        .then(function(doc) {
            if (doc.value) {
                resp.status(200).end();
            } else {
                resp.status(404).json({ Message: 'Something did go as expected :(' }).end();
            }
        });
    });


}
