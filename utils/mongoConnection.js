"use strict";
const pmongo = require('promised-mongo');
const connectionString = 'username:password@example.com/mydb';

const getDb = function(collectionName) {
    return pmongo(connectionString, [collectionName]);
};

module.exports = getDb;
