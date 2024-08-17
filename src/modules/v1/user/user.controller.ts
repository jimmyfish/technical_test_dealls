import { Controller, Get } from '@nestjs/common';
import { UserService } from '@modules/v1/user/user.service';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser() {
    return this.userService.getUsers();
  }
}
