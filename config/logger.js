const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const path = require('path');

// Define log message format
const logFormat = printf(({ level, message, timestamp }) => {
  //return the error message with timestamp and level
  return `[${timestamp}] ${level}: ${message}`;
});

//Create the logger instance
const logger = createLogger({
  //log everything info and above
  //Level info is 2: error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
  level: 'info', 
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    //Show logs in the console
    new transports.Console({
      //logs colored in console
      format: combine(colorize(), logFormat)
    }),
    //Save logs to files, stored in logs/ directory in the error and combined files
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, '../logs/combined.log') })
  ],
  //Stores the uncaught exceptions in a separate file
  exceptionHandlers: [
    new transports.File({ filename: path.join(__dirname, '../logs/exceptions.log') })
  ]
});


//export the logger
module.exports = logger;
