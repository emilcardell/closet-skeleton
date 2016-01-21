"use strict";
const pmongo = require('promised-mongo');
const config = require('../config.js');
const connectionString = config.mongoConnection + '/closetskeleton';

const getDb = function(collectionName) {
    return pmongo(connectionString, [collectionName]);
};

module.exports = getDb;
