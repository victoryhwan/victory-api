const winston       = require('winston');    				// 로그 처리 모듈
const winstonDaily  = require('winston-daily-rotate-file'); // 로그 일별 처리 모듈
const moment        = require('moment');    				// 시간 처리 모듈
const os            = require("os");

const logDir = `${os.tmpdir()}/logs`;
console.log(logDir)

const { combine, timestamp, label, printf, colorize, splat } = winston.format;

// const myFormat = printf(({ level, message, label, timestamp }) => {
//     return `${timestamp} [${label}] ${level}: ${message}`;    // log 출력 포맷 정의
// });

const myFormat = printf((info) => {
    if (info.meta && info.meta instanceof Error) {
        return `${info.timestamp} [${info.level.toUpperCase()}] ${info.message} : ${info.meta.stack}`;
    }
    return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
});

const logger = new (winston.createLogger)({

    // winston 모듈로 만드는 로거(Logger, 로그를 출력하는 객체를 말할 때 사용하는 용어)는 transports 라는 속성 값으로 여러 개의 설정 정보를 전달 할 수 있다.
    transports: [
        new (winstonDaily)({
            name: 'hiphoper-cms-api-log',
            filename: `${logDir}/cms-api-server_log_%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxsize: '20m',
            // maxFiles: '15d',
            level: 'debug',
            showLevel: true,
            json: false,
            zippedArchive: true,
            format: combine(
                label({label: 'hiphoper-cms-api'}),
                timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                splat(),
                myFormat
            )
        }),
        new (winston.transports.Console)({
            name: 'debug-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            format: combine (
                label({label: 'hiphoper-cms-api'}),
                timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                splat(),
                myFormat
            )
        })
    ],
    exceptionHandlers: [
        new (winstonDaily)({
            name: 'hiphoper-cms-api-err',
            filename: `${logDir}/cms-api-server_error_%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxsize: '20m',
            // maxFiles: '14d',
            level: 'error',
            showLevel: true,
            json: false,
            zippedArchive: true,
            format: combine (
                label({label: 'hiphoper-cms-api'}),
                timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                splat(),
                myFormat
            )
        }),
        new (winston.transports.Console)({
            name: 'exception-console',
            colorize: true,
            level: 'error',
            showLevel: true,
            json: false,
            format: combine (
                label({label: 'hiphoper-cms-api'}),
                timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                splat(),
                myFormat
            )
        })
    ]
});

// if(process.env.NODE_ENV !== 'production'){
//     logger.add(new winston.transports.Console(options.console)) // 개발 시 console로도 출력
// }

module.exports = logger;