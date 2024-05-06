// bullmq.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Processor, Queue, Worker } from 'bullmq';
import { RedisConnectionType } from '../../@types';
import { AirTableService } from '../../api/air-table/air-table.service';
import { logger } from '../../config/logger';
import { SYNC_AIR_TABLE_TO_DB_JOB } from '../../constants/bull-mq.constant';
import { GetRedisConfig } from '../../constants/redis.constant';
import { getLoggerPrefix } from '../../utils/logger-debug.util';

@Injectable()
export class BullMQService {
  private updateAirTableToDbQueue: Queue;
  private updateGoogleSheetToDbQueue: Queue;

  private redisConnection: RedisConnectionType;
  private localQueueState: {
    [key in string]: {
      queue?: Queue;
      worker?: Worker;
    };
  } = {};

  constructor(
    private readonly configService: ConfigService,
    private readonly airTableService: AirTableService,
  ) {
    const redisConfig = GetRedisConfig(configService);
    const redisConnection: RedisConnectionType = {
      host: redisConfig.REDIS_HOST,
      port: redisConfig.REDIS_PORT,
      password: configService.get<string>('REDIS-PASSWORD'),
    };

    //for local tls is not needed
    if (redisConfig.TLS) {
      redisConnection.tls = {
        host: redisConfig.REDIS_HOST,
        port: redisConfig.REDIS_PORT,
        password: configService.get<string>('REDIS-PASSWORD'),
      };
    }

    this.redisConnection = redisConnection;
    if (configService.get<string>('ENV') !== 'LOCAL') {
      this.initAirTableTODbQueue();
    }
  }

  private initAirTableTODbQueue(): void {
    logger.log('Initializing the Airtable queue');
    const queueName = 'sync-airtable-to-db-cron-queue';
    this.updateAirTableToDbQueue = this.createQueue(queueName);
    this.createWorker(
      queueName,
      async () => await this.airTableService.airTableSkillMatrix(),
    );
  }

  createQueue(queueName: string): Queue {
    if (!this.localQueueState[queueName]) {
      this.localQueueState[queueName] = {};
    }
    if (this.localQueueState?.[queueName]?.queue) {
      return this.localQueueState[queueName].queue;
    }
    const queue = new Queue(queueName, {
      connection: this.redisConnection,
      prefix: `{${queueName}}`,
    });
    this.localQueueState[queueName]['queue'] = queue;
    return queue;
  }

  createWorker(queueName: string, fn: string | null | Processor): Worker {
    if (!this.localQueueState[queueName]) {
      this.localQueueState[queueName] = {};
    }
    if (this.localQueueState?.[queueName]?.worker) {
      return this.localQueueState[queueName]?.worker;
    }
    const worker = new Worker(queueName, fn, {
      connection: this.redisConnection,
      prefix: `{${queueName}}`,
    });
    this.localQueueState[queueName]['worker'] = worker;
    return worker;
  }

  clear(queueName: string, type: 'queue' | 'worker'): void {
    if (this.localQueueState?.[queueName]) {
      delete this.localQueueState[queueName][type];
    }
  }

  async scheduleAirTableToDbSyncJob(): Promise<void> {
    logger.log(
      `${getLoggerPrefix()}: Inside schedule AirTable To Db Sync job bull mq`,
    );
    // Schedule the job to run every 24 hours using the cron syntax
    const airTableToDbSyncCron = await this.updateAirTableToDbQueue.add(
      'sync-airtable-to-db-job',
      { date: new Date().toUTCString() },
      {
        repeat: {
          pattern: SYNC_AIR_TABLE_TO_DB_JOB.REPEAT_FIRST_CRON_PATTERN_CONSTANT,
          limit: 1,
        },
        removeOnComplete: true,
        removeOnFail: {
          age: SYNC_AIR_TABLE_TO_DB_JOB.EXPIRY_TIME_CONSTANT, // keep up to 24 hours
        },
      },
    );
    logger.log(
      `${getLoggerPrefix()}:air table to db  time scheduled- ${JSON.stringify(
        airTableToDbSyncCron.data,
      )}`,
    );
  }
}
