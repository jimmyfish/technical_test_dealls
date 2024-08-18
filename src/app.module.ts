import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@modules/v1/user/user.module';
import { AppConfigModule } from '@config/app/config.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '@modules/v1/auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 10,
      },
    ]),
    AppConfigModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply()
  }
}
