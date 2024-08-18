import { z } from 'zod';

export const LoginSchema = z.object({
  phoneNumber: z.string({
    required_error: 'Phone number is required',
  }),
});

export const VerifyOTPSchema = z.object({
  phoneNumber: z.string({
    required_error: 'Phone number is required',
  }),
  otp: z.string({
    required_error: 'OTP is required',
  }),
});

export const RegisterSchema = z.object({
  phoneNumber: z.string({
    required_error: 'Phone number is required',
  }),
  firstName: z.string({
    required_error: 'First name is required',
  }),
  lastName: z.string().nullable().optional(),
  gender: z.enum(['male', 'female'], {
    required_error: 'Gender is required',
  }),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type VerifyOTPDto = z.infer<typeof VerifyOTPSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
