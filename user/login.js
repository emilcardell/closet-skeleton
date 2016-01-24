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

module.exports = function(app) {

    let mongoStore = new MongoDBStore({
        uri: config.mongoConnection,
        collection: 'passport-sessions'
    });

    mongoStore.on('error', function(error) {
        logger.error(error);
    });

    app.use(require('express-session')({
        secret: 'This is a secret',
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
        },
        store: mongoStore
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    let localStrategy = new LocalStrategy((username, password, done) => {
        if (!username || !password) {
            return done(null, false, { status: 400 });
        }

        let db = mongoDb('users');
        db.users.findOne({ emailKey: username.toLowerCase(), isAuthenticated: true, isDeleted: false })
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
                        });


                    } else {
                        return done(null, false, { status: 400 });
                    }
                });
            });
    });

    passport.use(localStrategy);

    passport.serializeUser(function(user, done) {
        done(null, user.AuthentcationId);
    });

    passport.deserializeUser(function(id, done) {
        let cachedValue = getUserFromCacheByAuthId(id);

        if (cachedValue) {
            return done(null, cachedValue);
        } else {
            let db = mongoDb('users');
            db.users.findOne({ 'AuthentictionTokens.AuthentcationId': id, isAuthenticated: true, isDeleted: false })
            .then((user) => {
                if (user) {
                    if (!user.AuthentictionTokens) {
                        return done(null, false, { message: 'Authentcation tolken not found.' });
                    }
                    user.AuthentictionTokens.forEach((token) => {
                        if (token.AuthentcationId === id) {
                            let authId = addAuthenticationIdToUser(user);
                            let cachableUser = createAuthenticatedCachableUser(authId, user);
                            setUserToCacheByAuthId(cachableUser);
                            return done(null, cachableUser);
                        }
                    });
                    return done(null, false, { message: 'Authentcation tolken not found.' });
                }
                return done(null, false, { status: 400 });
            });
        }
    });


    app.post('/login', function (req, resp, next) {
        passport.authenticate('local', function (err, user, info) {
            if (!!info && info.status && info.status > 200) {
                return resp.send(info.status);
            }

            let redirectUrl = null;
            req.logIn(user, function (err) {
                if (err) {
                    return resp.send(500);
                }

                if (req.session.loginTarget) {
                    redirectUrl = req.session.loginTarget;
                    delete req.session.loginTarget;
                } else {
                    redirectUrl = '/u/' + user.Username;
                }

                return resp.json( { RedirectTo: redirectUrl } );
            });
        }) (req, resp, next);
    });
};

const getUserFromCacheByAuthId = function(authId) {
    return loginCache.get( "user-by-auth" + authId );
};

const setUserToCacheByAuthId = function(cachableUser) {
    return loginCache.set( "user-by-auth" + cachableUser.authId, cachableUser);
};

const createAuthedCachableUser = function(user, db) {
    let createPromise = new Promise((resolve, reject) => {

        if (!user.AuthentictionTokens) {
            user.AuthentictionTokens = [];
        }

        let authId = addAuthenticationIdToUser(user);
        let cachableUser = createAuthenticatedCachableUser(authId, user);

        db.users.save(user, function(err, saved) {
            if (err || !saved) {
                reject(err);
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
        authId: selectedAuthId
    };

    return cachableUser;
};

const addAuthenticationIdToUser = function(user) {
    let expireDate = new Date().addDays(30);
    let authentcationId = uuid.v1();

    if (!user.AuthentictionTokens) {
        user.AuthentictionTokens = [];
    } else if (user.AuthentictionTokens.length > 3) {
        user.AuthentictionTokens = [];
    }

    user.AuthentictionTokens.push({ AuthentcationId: authentcationId, Expires: expireDate });

    return authentcationId;
};
