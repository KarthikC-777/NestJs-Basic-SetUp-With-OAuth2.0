import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors';
import { GlobalExceptionHandler } from './handlers/global_exception.handler';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { logger } from './config/logger';
import { urlencoded } from 'express';
import { requestLogger } from './config/morgan';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });
  const httpAdapter = app.get(HttpAdapterHost);
  const configService: ConfigService = app.get(ConfigService);

  // set up morgan
  app.use(requestLogger);
  // handle global errors
  app.useGlobalFilters(new GlobalExceptionHandler(httpAdapter, configService));
  // handle validation pipes
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(corsConfig);
  // application/x-www-form-urlencoded
  app.use(urlencoded({ extended: false }));

  app.use(cookieParser()); // cookie parser middleware
  await app.listen(process.env.PORT || 3000);
  logger.log(`App Running on port ${process.env.PORT}`);
}
bootstrap();
