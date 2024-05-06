import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'nestjs-redis';

import { AirTableModule } from '../../api/air-table/air-table.module';
import { GetRedisConfig } from '../../constants/redis.constant';

@Module({
  imports: [
    ConfigModule.forRoot(), // Initialize the ConfigModule
    BullModule.forRootAsync({
      // Use the ConfigService to provide the Redis configuration
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = GetRedisConfig(configService);
        return {
          redis: {
            connectionName: `REDIS_${configService.get<string>('ENV')}`,
            host: redisConfig.REDIS_HOST,
            port: redisConfig.REDIS_PORT,
            password: configService.get<string>('REDIS-PASSWORD'),
          },
        };
      },
    }),
    RedisModule,
    AirTableModule,
  ],
  exports: [BullModule],
})
export class BullMQModule {}
