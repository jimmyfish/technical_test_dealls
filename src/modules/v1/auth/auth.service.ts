import { Injectable } from '@nestjs/common';
import { PrismaService } from '@config/database/prisma/config.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}


}
