import { Module } from '@nestjs/common';
import { PrismaService } from '@config/database/prisma/config.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
