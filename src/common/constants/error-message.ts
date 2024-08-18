export const ERROR = {
  USER_NOT_FOUND: { code: 10001, message: 'User not found.' },
  USER_DUPLICATE_PHONE: {
    code: 10002,
    message: 'Phone number already registered.',
  },

  OTP_DATA_NOT_FOUND: { code: 20002, message: 'OTP data not found or expired' },
  OTP_INCORRECT: { code: 20003, message: 'OTP incorrect' },
  OTP_EXHAUSTED: { code: 20004, message: 'OTP incorrect, attempt exhausted' },
};
