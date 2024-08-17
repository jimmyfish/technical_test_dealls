import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private prismaClient: PrismaClient) {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async OnModuleInit(): Promise<void> {
    await this.$connect();
    this.prismaClient.$use(async (params, next) => {
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
    await this.prismaClient.$disconnect();
  }

  onModuleInit(): any {}
}
