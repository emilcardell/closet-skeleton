const app = require('./server.js');
const logger = require('./utils/logger.js');

process.on('uncaughtException', function (error) {
    logger.error(error);
    process.exit(1);
});

app.start();
