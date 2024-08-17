import { Controller, Get } from '@nestjs/common';
import { UserService } from '@modules/v1/user/user.service';
import {
  createSuccessResponse,
  SuccessResponse,
} from '@common/helpers/response.helper';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(): Promise<SuccessResponse> {
    return createSuccessResponse(await this.userService.getUsers());
  }
}
