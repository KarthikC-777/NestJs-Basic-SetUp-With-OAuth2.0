import { ConfigService } from '@nestjs/config';

export const GetRedisConfig = (
  configService: ConfigService,
): {
  REDIS_HOST: string;
  REDIS_PORT: number;
  TLS: boolean;
} => {
  return {
    REDIS_HOST: configService.get<string>('REDIS-HOST'),
    REDIS_PORT: Number(configService.get<number>('REDIS-PORT')),
    TLS: configService.get<string>('TLS') === 'true',
  };
};
