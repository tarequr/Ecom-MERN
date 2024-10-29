const { createLogger, format, transports } = require('winston');

//used here winston package
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
    ),
    transports: [
        new transports.File({
            filename: 'src/logs/info.log',
            level: 'info',
            maxsize: 5242880, // 5 MB
            maxFiles: 5
        }),

        new transports.File({
            filename: 'src/logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5 MB
            maxFiles: 5
        })


        // 2nd way
        // new transports.Console({
        //     format: format.combine(format.colorize(), format.simple()) 
        // }),
    ],
});

module.exports = logger;