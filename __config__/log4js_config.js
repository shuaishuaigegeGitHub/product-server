const logDir = `${__dirname}/../logs/`;

const config = {
    appenders: {
        res: {
            type: 'dateFile',
            filename: logDir,
            alwaysIncludePattern: true,
            compress: true,
            pattern: 'res-yyyy-MM-dd-hh.log',
            encoding: 'utf-8',
            maxLogSize: 1024
        },
        main: {
            type: 'dateFile',
            filename: logDir,
            alwaysIncludePattern: true,
            compress: true,
            pattern: 'main-yyyy-MM-dd-hh.log',
            encoding: 'utf-8',
            maxLogSize: 1024
        },
        error: {
            type: 'dateFile',
            filename: logDir,
            alwaysIncludePattern: true,
            compress: true,
            pattern: 'err-yyyy-MM-dd-hh.log',
            encoding: 'utf-8',
            maxLogSize: 1024
        },
    },
    categories: {
        error: {
            appenders: ['error'],
            level: 'error'
        },
        default: {
            appenders: ['main'],
            level: 'error'
        },
        res: {
            appenders: ['res'],
            level: 'info'
        },
        main: {
            appenders: ['main'],
            level: 'info'
        },
    }
};

module.exports = config;
