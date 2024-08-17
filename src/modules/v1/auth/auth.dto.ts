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
  otp: z.string(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type VerifyOTPDto = z.infer<typeof VerifyOTPSchema>;
