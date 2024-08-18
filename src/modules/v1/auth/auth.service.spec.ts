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

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  const phoneNumber: string = '08990314474';

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
  });

  it('should be defined', () => expect(authService).toBeDefined());

  it('should login with phone number', async () => {
    const body: LoginDto = { phoneNumber: '08990314474' };
    const serviceReturn = await authService.loginByPhoneNumber(body);

    expect(serviceReturn).toEqual({
      success: true,
    });
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

  it('should register by phone', async () => {
    const randNum = Math.floor(Math.random() * 1000);
    const phone = copycat.phoneNumber(randNum, {
      prefixes: ['+628'],
      length: 13,
    });
    const body: RegisterDto = {
      phoneNumber: await uniformPhoneNumber(phone),
      firstName: copycat.firstName(randNum),
    };

    const serviceReturn = await authService.registerByPhone(body);

    expect(serviceReturn).toEqual({
      success: true,
    });
  });
});
