import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersModule } from './modules/v1/users/users.module';
import { UserModule } from './modules/v1/user/user.module';

@Module({
  imports: [UsersModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
