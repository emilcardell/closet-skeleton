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

    let mongoStore = new MongoDBStore({
        uri: config.mongoConnection + 'loginsession',
        collection: 'passport-sessions'
    });

    mongoStore.on('error', function(error) {
        logger.error(error);
    });

    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        store: mongoStore,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 } // 30 days }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    let localStrategy = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        if (!email || !password) {
            return done(null, false, { status: 400 });
        }

        let db = mongoDb('users');
        db.users.findOne({ emailKey: email.toLowerCase(), isAuthenticated: true, isDeleted: false })
            .then(function(user) {
                if (!user) {
                    return done(null, false, { status: 400 });
                }

                bcrypt.compare(password, user.passwordHash, function(err, res) {
                    if (res) {

                        createAuthedCachableUser(user, db).then((cachableUser) => {
                            setUserToCacheByAuthId(cachableUser);
                            return done(null, cachableUser);
                        }, (err) => {
                            logger.err(err);
                            return done(null, false, { status: 500 });
                        });


                    } else {
                        return done(null, false, { status: 400 });
                    }
                });
            });

    });

    passport.use('local-login', localStrategy);

    passport.serializeUser(function(user, done) {
        done(null, user.AuthentcationId);
    });

    passport.deserializeUser(function(id, done) {
        let cachedValue = getUserFromCacheByAuthId(id);
        if (cachedValue) {
            return done(null, cachedValue);
        } else {
            let db = mongoDb('users');
            db.users.findOne({ "AuthentictionTokens": { "$elemMatch": { "AuthentcationId": id } }, isAuthenticated: true, isDeleted: false })
            .then((user) => {
                if (user) {
                    let currentToken = user.AuthentictionTokens.find((token) => {
                        return token.AuthentcationId === id;
                    });

                    if (!moment().isBefore(currentToken.Expires)) {
                        return done(null, false, { status: 400 });
                    }

                    let cachableUser = createAuthenticatedCachableUser(id, user);
                    setUserToCacheByAuthId(cachableUser);
                    return done(null, cachableUser);
                }
                return done(null, false, { status: 400 });
            });
        }
    });


    app.get('/login', function (req, resp) {
        resp.render('login');
    });

    app.post('/api/user/login',
        passport.authenticate('local-login'),
        function(req, res) {
            res.status(200).end();
        });
};

const getUserFromCacheByAuthId = function(authId) {
    return loginCache.get( "user-by-auth" + authId );
};

const setUserToCacheByAuthId = function(cachableUser) {
    return loginCache.set( "user-by-auth" + cachableUser.AuthentcationId, cachableUser);
};

const createAuthedCachableUser = function(user, db) {
    let createPromise = new Promise((resolve, reject) => {
        if (!user.AuthentictionTokens) {
            user.AuthentictionTokens = [];
        }

        let authId = addAuthenticationIdToUser(user);
        let cachableUser = createAuthenticatedCachableUser(authId, user);

        db.users.save(user).then(function(user) {
            if (!user) {

                reject('Problem saveing user');
            } else {
                resolve(cachableUser);
            }
        });

    });

    return createPromise;
};

const createAuthenticatedCachableUser = function(selectedAuthId, user) {
    let cachableUser = {
        _id: user._id,
        fullName: user.fullName,
        isAdmin: user.isAdmin,
        accountType: user.accountType,
        AuthentcationId: selectedAuthId
    };
    return cachableUser;
};

const addAuthenticationIdToUser = function(user) {

    let authentcationId = uuid.v4();

    if (!user.AuthentictionTokens) {
        user.AuthentictionTokens = [];
    } else if (user.AuthentictionTokens.length > 3) {
        user.AuthentictionTokens = [];
    }

    user.AuthentictionTokens.push({ AuthentcationId: authentcationId, Expires: moment().add(30, 'days').toString() });
    return authentcationId;
};
