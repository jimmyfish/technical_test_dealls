import { Module } from '@nestjs/common';
import { AuthService } from '@modules/v1/auth/auth.service';
import { AuthController } from '@modules/v1/auth/auth.controller';
import { PrismaModule } from '@config/database/prisma/config.module';
import moment from 'moment';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '@config/app/config.module';
import { AppConfigService } from '@config/app/config.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'MomentWrapper',
      useValue: moment,
    },
  ],
})
export class AuthModule {}
