"use strict";
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('./utils/logger.js');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

app.engine('handlebars', exphbs({ defaultLayout: 'public' }));
app.set('view engine', 'handlebars');

app.use('/static', express.static('static'));
app.use(cookieParser());
app.use(bodyParser.json());

require('./user/index.js')(app);
require('./utils/sendEmail.js').setUp();
require('./admin/startpage.js')(app);

// Handle 404
app.use(function(req, resp, next) {
    resp.status(400);
    resp.render('message_notFound');
});

// Handle 500
app.use(function(err, req, res, next) {
    res.status(500).render('message_serverError');
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
