const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info',
    exitOnError: false,
    format: format.combine(
        format.timestamp(),
        format.simple()
    ),
});

logger.add(new transports.File({ filename: 'error.log', level: 'error' }));
logger.add(new transports.File({ filename: 'application.log' }));
logger.add(new transports.Console());

module.exports = logger;