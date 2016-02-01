"use strict";
const logger = require('../utils/logger.js');
const mongoDb = require('../utils/mongoConnection.js');
const uuid = require('uuid');
const bcrypt = require('bcrypt-nodejs');
const NodeCache = require( "node-cache" );
const loginCache = new NodeCache( { stdTTL: 60, checkperiod: 120 } );
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const config = require('../config.js');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const moment = require('moment');

module.exports = function(app) {
    app.get('/resetPassword', (req, resp) => {
        resp.render('resetPassword');
    });
}
