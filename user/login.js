"use strict";
const logger = require('../utils/logger.js');
const iz = require('iz');
const are = iz.are;
const mongoDb = require('../utils/mongoConnection.js');
const uuid = require('uuid');
const bcrypt = require('bcrypt-nodejs');
const NodeCache = require( "node-cache" );
const loginCache = new NodeCache( { stdTTL: 60, checkperiod: 120 } );
const express = require('express');
const MongoStore = require('connect-mongo')(express);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const config = require('../config.js');

module.exports = function(app) {

    let mongoStore = new MongoStore({
        db: "passport-session",
        host: config.mongoConnection
    }, function () {
        app.use(express.session({
            secret: "This is my secret",
            store: mongoStore
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        // Handle 404
        app.use(function(req, resp) {
            resp.status(400);
            shared.renderWithCurrentUser(req, resp, 'message_notNotFound',  { CurrentRoute: req.path, OverrideTitle: "Not Found - " + req.path } );
        });

        // Handle 500
        app.use(function(error, req, res) {
            res.status(500);
            shared.renderWithCurrentUser(req, res, 'message_error',  {} );
        });

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
                            //Fix userdata and add to cache
                            return done(null, user);
                        }
                        return done(null, false, { status: 400 });
                    });

                });


        });

        passport.use(localStrategy);

        passport.serializeUser(function(user, done) {
            done(null, user.AuthentcationId);
        });

        passport.deserializeUser(function(id, done) {
            let cachedValue = getUserFromCacheByAuthId(id);

            if (!!cachedValue) {
                return done(null, cachedValue);
            } else {
                //get user by auth id.
                //return done(null, false, { status: 400 });
                //return done(null, false, { message: 'Something went horribly wrong.' });
                //return done(null, false, { message: 'Authentcation tolken not found.' });
            }
        });
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
                }
				else {
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

const createSession = function(user, resp, db)
{

    if (!user.AuthentictionTokens) {
        user.AuthentictionTokens = [];
    }
    let authId = addAuthenticationIdToUser(user);

    db.users.save(user, function(err, saved){
        if (err || !saved) {
            resp.send(500);
        } else {
            resp.json(getAuthenticatedUserInfo(user, authId), 200);
        }
    });
};

const getAuthenticatedUserData = function(user) {

}

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
