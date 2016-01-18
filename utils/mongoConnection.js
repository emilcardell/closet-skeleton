"use strict";
const pmongo = require('promised-mongo');
const connectionString = 'mongodb://192.168.33.103:27017/closetskeleton';

const getDb = function(collectionName) {
    return pmongo(connectionString, [collectionName]);
};

module.exports = getDb;
