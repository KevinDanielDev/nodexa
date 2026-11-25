import * as argon2 from 'argon2';

export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  try {
    const isPasswordValid = await argon2.verify(passwordHash, password);
    return isPasswordValid;
  } catch {
    return false;
  }
};
