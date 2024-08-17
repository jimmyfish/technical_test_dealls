import { Controller, Get } from '@nestjs/common';
import { UserService } from '@modules/v1/user/user.service';
import { createSuccessResponse } from '@common/helpers/response.helper';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser() {
    return createSuccessResponse(await this.userService.getUsers());
  }
}
