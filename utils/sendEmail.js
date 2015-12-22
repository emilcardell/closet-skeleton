"use strict";
const nodemailer = require('nodemailer');
const nodemailerHandlebars = require('nodemailer-express-handlebars');
const handlebars = require('express-handlebars');
const path = require('path');
const logger = require('./utils/logger.js');


let currentTransporter = null;

const setUp = function(transporter) {
    currentTransporter = transporter;

    let viewEngine = handlebars.create({});
    let viewEngineOptions = nodemailerHandlebars({
        viewEngine: viewEngine,
        viewPath: path.resolve(__dirname, 'emailTemplates')
    });

    currentTransporter.use('compile', viewEngineOptions);
};

let globalListner = null;
const setGlobalListner = function(listner) {
    globalListner = listner;
}

const sendEmail = function(emailToSend) {

    let sender = 'donotreply@mydomain.com';
    if(emailToSend.from){
        sender = emailToSend.from;
    }
    let mailOptions = {
        from: sender, // sender address
        to: emailToSend.to, // list of receivers
        subject: emailToSend.subject, // Subject line
        template: emailToSend.template,
        context: emailToSend.context
    };

    currentTransporter.sendMail(mailOptions, function(error, info) {
        if(globalListner) {
            globalListner(error, info);
        }

        return new Promise((resolve, reject) => {
            if (error) {
                logger.error(error);
                reject(error);
                return;
            }

            resolve(info);
        });
    });
};


module.export = {
    setUp: setUp,
    sendEmail: sendEmail,
    setGlobalListner:
}
