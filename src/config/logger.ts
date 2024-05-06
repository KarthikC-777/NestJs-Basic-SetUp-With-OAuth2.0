import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDailyRotateFile from 'winston-daily-rotate-file';
import * as httpContext from 'express-http-context';

const format: winston.Logform.Format = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),

  winston.format.colorize({
    colors: {
      info: 'blue',
      debug: 'yellow',
      error: 'red',
    },
  }),
  winston.format.printf(
    (
      info: winston.Logform.TransformableInfo &
        Partial<{
          requestId: string;
          sessionId: string;
        }>,
    ) => {
      const context = info.context;
      const requestId = httpContext.get('requestId');
      const sessionId = httpContext.get(requestId);
      // log format will be like this
      // 2022-11-23 20:14:33 [info] [nest-js-poc] [0.0.1] [NestApplication] Nest application successfully started
      info.message = `${info.timestamp} [${info.level}] [${
        process.env['npm_package_name']
      }] [${process.env['npm_package_version']}]${
        context ? ' [' + context + ']' : ''
      } [requestId : ${requestId || '❌'}] [sessionId : ${sessionId || '❌'}] ${
        info.message
      } ${info.stack || ''}`;
      return info.message;
    },
  ),
);

const transports = {
  console: new winston.transports.Console({
    level: 'silly',
    format,
  }),
  combinedFile: new winstonDailyRotateFile({
    dirname: 'logs',
    filename: 'combined',
    extension: '.log',
    level: 'info',
    format,
  }),
  errorFile: new winstonDailyRotateFile({
    dirname: 'logs',
    filename: 'error',
    extension: '.log',
    level: 'error',
    format,
  }),
};

export const logger = WinstonModule.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: [
    transports.console,
    transports.combinedFile,
    transports.errorFile,
  ],
});
