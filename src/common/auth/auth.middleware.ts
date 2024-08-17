import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, _res: Response, next: () => void) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (!token || type === 'Bearer') {
      throw new UnauthorizedException('Unauthorized.');
    }

    try {
      req.headers = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Unauthorized.');
    }

    next();
  }
}
