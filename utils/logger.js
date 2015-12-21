const bunyan = require('bunyan');
const logger = bunyan.createLogger( { name: 'closet-skeleton' } );

module.exports = logger;
