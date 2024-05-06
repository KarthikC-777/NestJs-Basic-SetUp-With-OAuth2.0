import * as morgan from 'morgan';
import { logger } from './logger';

export const requestLogger = morgan('combined', {
  skip: () => process.env.ENV.toLowerCase() === 'production',
  stream: { write: (message: string) => logger.log(message.trim()) },
});
