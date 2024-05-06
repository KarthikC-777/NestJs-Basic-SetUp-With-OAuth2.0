import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AirTableModule } from './api/air-table/air-table.module';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';

import { DBConfig } from './config/db';
import { RolesGuard } from './guards/roles.guard';
import { BullMQService } from './modules/bull-mq/bull-mq.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [], // Load the configuration
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        DBConfig(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    AirTableModule,
  ],
  controllers: [],
  providers: [
    BullMQService,
    //todo: fix guard issue in ec2 when https is implemented
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  constructor(
    private readonly bullMQService: BullMQService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.configService.get<string>('ENV') === 'LOCAL') return;
    await this.bullMQService.scheduleAirTableToDbSyncJob();
  }
}
