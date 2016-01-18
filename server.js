"use strict";
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('./utils/logger.js');

app.use('/', express.static('static'));
app.use(bodyParser.json());

app.get('/', (req, resp) => {
    resp.json( { message: "Server is running. Rejoice!" } );
});

require('./utils/sendEmail.js').setUp();
require('./user/createUser.js')(app);
require('./user/authenticateUser.js')(app);

let server = null;

exports.start = function() {
    return new Promise(function (resolve) {
        server = app.listen(7771, () => {
            let host = server.address().address;
            let port = server.address().port;

            logger.info('Server listening at http://%s:%s', host, port);
            resolve();
        });
    });
};

exports.stop = function() {
    if (server) {
        server.close();
    }
};
