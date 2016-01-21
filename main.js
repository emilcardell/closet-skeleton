const app = require('./server.js');

process.on('uncaughtException', function (error) {
	console.log("ERROR uncaughtException");
	console.error((new Date).toISOString() + ' uncaughtException:', error.message);
	console.error(error.stack);
	log.log("err", error)
	process.exit(1);
});

app.start();
