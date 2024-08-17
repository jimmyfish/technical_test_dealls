import { Injectable } from '@nestjs/common';
import { PrismaService } from '@config/database/prisma/config.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        planType: true,
      },
    });
  }
}
