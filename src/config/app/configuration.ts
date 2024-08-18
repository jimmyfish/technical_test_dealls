import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME || 'nestjs',
  url: process.env.APP_URL || 'http://localhost',
  jwtSecret: process.env.JWT_SECRET || 'http://localhost',
}));
