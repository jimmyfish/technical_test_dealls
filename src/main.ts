import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from '@config/app/config.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const isProduction = process.env.APP_ENV === 'production';
  const logLevels: LogLevel[] = isProduction
    ? ['error', 'warn', 'log']
    : ['error', 'warn', 'log', 'debug', 'verbose'];

  const app = await NestFactory.create<NestApplication>(AppModule, {
    cors: true,
    logger: logLevels,
  });

  const appConfig: AppConfigService = app.get(AppConfigService);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(appConfig.port);
}
bootstrap();
