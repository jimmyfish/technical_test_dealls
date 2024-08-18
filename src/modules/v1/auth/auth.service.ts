import { Injectable } from '@nestjs/common';
import { PrismaService } from '@config/database/prisma/config.service';
import { uniformPhoneNumber } from '@common/helpers/localization.helper';
import { createBadRequestResponse } from '@common/helpers/response.helper';
import { ERROR } from '@common/constants/error-message';
import { LoginDto, RegisterDto, VerifyOTPDto } from '@modules/v1/auth/auth.dto';
import { generateOtp } from '@common/helpers/otp.helper';
import * as moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { v7 as uuidv7 } from 'uuid';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async loginByPhoneNumber(body: LoginDto) {
    let { phoneNumber } = body;
    phoneNumber = await uniformPhoneNumber(phoneNumber);
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
      select: {
        id: true,
      },
    });

    if (!user) return createBadRequestResponse(ERROR.USER_NOT_FOUND);

    await this.prisma.otpList.updateMany({
      where: { key: phoneNumber },
      data: { deletedAt: moment().toDate() },
    });

    const otp = await generateOtp();

    await this.prisma.otpList.create({
      data: {
        key: phoneNumber,
        otpData: otp,
        expiredAt: moment().add(3, 'days').toDate(),
      },
    });

    return { success: true };
  }

  async verifyOtp(body: VerifyOTPDto) {
    let { phoneNumber } = body;
    const { otp } = body;

    phoneNumber = await uniformPhoneNumber(phoneNumber);
    const otpData = await this.prisma.otpList.findFirst({
      where: {
        key: phoneNumber,
        expiredAt: { gt: moment().toDate() },
      },
    });

    if (!otpData) return createBadRequestResponse(ERROR.OTP_DATA_NOT_FOUND);

    if (otpData.otpData !== otp) {
      if (otpData.attempts <= 1) {
        console.log(otpData);
        await this.prisma.otpList.update({
          where: {
            id: otpData.id,
          },
          data: {
            attempts: otpData.attempts - 1,
            deletedAt: moment().toDate(),
          },
        });

        return createBadRequestResponse(ERROR.OTP_EXHAUSTED);
      }

      await this.prisma.otpList.update({
        where: {
          id: otpData.id,
        },
        data: {
          attempts: otpData.attempts - 1,
        },
      });

      return createBadRequestResponse(ERROR.OTP_INCORRECT);
    }

    const user = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });

    return {
      userId: user.id,
      access_token: this.jwtService.sign({ userId: user.id }),
    };
  }

  async registerByPhone(body: RegisterDto) {
    let { phoneNumber } = body;
    const { firstName, lastName, gender } = body;

    phoneNumber = await uniformPhoneNumber(phoneNumber);
    const duplicatedPhoneNumber = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (duplicatedPhoneNumber) {
      return createBadRequestResponse(ERROR.USER_DUPLICATE_PHONE);
    }

    const userData: Prisma.UserCreateInput = {
      id: uuidv7(),
      firstName,
      lastName: lastName ? lastName : null,
      phoneNumber,
      gender,
      planType: 'free',
      lastLogin: moment().toDate(),
      deletedAt: null,
    };

    await this.prisma.user.create({ data: userData });

    return { success: true };
  }
}
