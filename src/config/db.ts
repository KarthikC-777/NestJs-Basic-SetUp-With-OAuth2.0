import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export const DBConfig = (
  configService: ConfigService,
): MongooseModuleOptions => ({
  uri: configService.get<string>('MONGO_DB_URI'),
  dbName: configService.get<string>('DB-NAME'),
});
