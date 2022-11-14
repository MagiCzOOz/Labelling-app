import { createLogger, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const customFormat = format.combine(
    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
    format.align(),
    format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`),
);

const transport = (filename: string): DailyRotateFile => {
    return new DailyRotateFile({
        filename: filename,
        zippedArchive: true,
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        level: 'info',
        format: customFormat,
    });
};

export const authLogger = createLogger({
    transports: [transport('logs/auth/authLog-%DATE%.log')],
});

export const appLogger = createLogger({
    transports: [transport('logs/app/appLog-%DATE%.log')],
});
