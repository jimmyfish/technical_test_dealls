import { Controller, Post } from '@nestjs/common';
import { AuthService } from '@modules/v1/auth/auth.service';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login() {

  }
}
