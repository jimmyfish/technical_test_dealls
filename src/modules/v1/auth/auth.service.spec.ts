import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../config/database/prisma/config.service';
import { LoginDto, RegisterDto, VerifyOTPDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { uniformPhoneNumber } from '../../../common/helpers/localization.helper';
import { copycat } from '@snaplet/copycat';
import { phoneNumber } from '@snaplet/copycat/dist/phoneNumber';
import { BadRequestException } from '@nestjs/common';
import { createBadRequestResponse } from '../../../common/helpers/response.helper';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  let phoneNumber: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [ConfigModule.forRoot()],
      imports: [UserModule],
      providers: [
        AuthService,
        JwtService,
        PrismaService,
        UserService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('signed-token'),
            verify: jest.fn().mockReturnValue({
              userId: '0191640d-1f6b-7ccd-a6e0-4ce12eea3962',
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);

    const firstUser = await prismaService.user.findFirst({
      select: { phoneNumber: true },
    });

    phoneNumber = firstUser.phoneNumber;
  });

  it('should be defined', () => expect(authService).toBeDefined());

  it('should login with phone number', async () => {
    const body: LoginDto = { phoneNumber };
    const serviceReturn = await authService.loginByPhoneNumber(body);

    expect(serviceReturn).toEqual({
      success: true,
    });
  });

  it('should error with phone number not found', async () => {
    const body: LoginDto = { phoneNumber: '089903144544' };

    await expect(authService.loginByPhoneNumber(body)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should verify otp', async () => {
    let phone = await uniformPhoneNumber(phoneNumber);
    const otpData = await prismaService.otpList.findFirst({
      where: { key: phone },
      select: { otpData: true },
    });
    const user = await prismaService.user.findUnique({
      where: { phoneNumber: phone },
    });

    const body: VerifyOTPDto = { phoneNumber, otp: otpData.otpData };
    const serviceReturn = await authService.verifyOtp(body);

    expect(serviceReturn).toEqual({
      access_token: 'signed-token',
      userId: user.id,
    });
  });

  it('should not found otp', async () => {
    const body: VerifyOTPDto = { phoneNumber: '089903144544', otp: '898918' };

    await expect(authService.verifyOtp(body)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should register by phone', async () => {
    const randNum = Math.floor(Math.random() * 1000);
    const phone = copycat.phoneNumber(randNum, {
      prefixes: ['+628'],
      length: 13,
    });
    const uniformedPhone = await uniformPhoneNumber(phone);

    const body: RegisterDto = {
      phoneNumber: uniformedPhone,
      firstName: copycat.firstName(randNum),
    };

    const serviceReturn = await authService.registerByPhone(body);

    expect(serviceReturn).toEqual({
      success: true,
    });

    const user = await prismaService.user.count({
      where: { phoneNumber: uniformedPhone },
    });

    expect(user).toBe(1);
  });

  it('should already register', async () => {
    const randNum = Math.floor(Math.random() * 1000);
    const body: RegisterDto = {
      phoneNumber,
      firstName: copycat.firstName(randNum),
    };
    
    await expect(authService.registerByPhone(body)).rejects.toThrow(
      BadRequestException,
    );
  });
});
