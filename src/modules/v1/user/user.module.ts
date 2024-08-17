import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '@config/database/prisma/config.module';
import { UserController } from '@modules/v1/user/user.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
