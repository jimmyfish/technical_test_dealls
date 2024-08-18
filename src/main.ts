import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppConfigService } from '@config/app/config.service';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';

async function bootstrap() {
  // const isProduction = process.env.APP_ENV === 'production';
  // const logLevels: LogLevel[] = isProduction
  //   ? ['error', 'warn', 'log']
  //   : ['error', 'warn', 'log', 'debug', 'verbose'];

  const logLevels = {
    production: ['error', 'warn', 'log'],
    node: [],
  };

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: process.env.APP_ENV
      ? logLevels[process.env.APP_ENV]
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const appConfig: AppConfigService = app.get(AppConfigService);

  app.use(cookieParser());
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalFilters(new ZodFilter());

  app.setGlobalPrefix('api');

  await app.listen(appConfig.port);
}
bootstrap();
