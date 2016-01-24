"use strict";
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('./utils/logger.js');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

app.engine('handlebars', exphbs({ defaultLayout: 'public' }));
app.set('view engine', 'handlebars');

app.use('/', express.static('static'));
app.use(cookieParser());
app.use(bodyParser.json());




app.get('/', (req, resp) => {
    resp.json( { message: "Server is running. Rejoice!" } );
});

require('./utils/sendEmail.js').setUp();
require('./user/createUser.js')(app);
require('./user/authenticateUser.js')(app);
require('./user/login.js')(app);

// Handle 404
app.use(function(req, resp) {
    resp.status(400);
    resp.render('message_notFound');
});

// Handle 500
app.use(function(error, req, resp) {
    resp.status(500);
    resp.render('message_serverError');
});

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
