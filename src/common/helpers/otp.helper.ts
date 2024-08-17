export async function generateOtp(length: number = 6): Promise<string> {
  const min: number = Math.ceil(parseInt('1'.padEnd(length, '0')));
  const max: number = Math.floor(parseInt('9'.padEnd(length, '9')));

  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}
