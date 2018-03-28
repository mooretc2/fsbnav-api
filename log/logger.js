var winston = require('winston');
var path = require('path');

// Set this to whatever, by default the path of the script.
var logPath = __dirname;

function formatParams(info) {
  const { timestamp, level, message, ...args } = info;
  const ts = timestamp.slice(0, 19).replace("T", " ");

  return `${ts} ${level}: ${message} ${Object.keys(args).length
    ? JSON.stringify(args, "", "")
    : ""}`;
}

const errorLog = new (winston.createLogger)({
    format: winston.format.combine(
        winston.format.colorize(),
	winston.format.timestamp(),
	winston.format.align(),
        winston.format.printf(formatParams)
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logPath, 'errors.log'),            
            level: 'info'})
    ]
});

const accessLog = new (winston.createLogger)({
    format: winston.format.combine(
        winston.format.colorize(),
	winston.format.timestamp(),
	winston.format.align(),
        winston.format.printf(formatParams)
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logPath, 'access.log'),            
            level: 'info'})
    ]
});   

module.exports = {
    errorLog: errorLog,
    accessLog: accessLog
};
