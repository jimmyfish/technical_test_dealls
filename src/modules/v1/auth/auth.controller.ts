import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@modules/v1/auth/auth.service';
import { createSuccessResponse } from '@common/helpers/response.helper';
import { ZodValidationPipe } from '@common/zod/zod.pipe';
import {
  LoginDto,
  LoginSchema,
  VerifyOTPDto,
  VerifyOTPSchema,
} from '@modules/v1/auth/auth.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body(new ZodValidationPipe(LoginSchema)) body: LoginDto) {
    return createSuccessResponse(
      await this.authService.loginByPhoneNumber(body),
    );
  }

  @Post('verify-otp')
  async verifyOTP(
    @Body(new ZodValidationPipe(VerifyOTPSchema)) body: VerifyOTPDto,
  ) {
    return createSuccessResponse(await this.authService.verifyOtp(body));
  }
}
