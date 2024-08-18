import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as moment from 'moment';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // const logLevels = {
    //   production: ['error', 'warn', 'log'],
    //   node: [],
    // };

    super({
      // process.env.APP_ENV
      //   ? logLevels[process.env.APP_ENV]
      //   : ['error', 'warn', 'log', 'debug', 'verbose'],
    });
  }

  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      if (['findMany', 'findUnique', 'findFirst'].includes(params.action)) {
        if (params.args) {
          params.args.where = {
            ...params.args.where,
            deletedAt: null,
          };
        }
      }

      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
