import bcrypt from "bcryptjs";

const hashPassword = async (plainPassword: string) => {
  return bcrypt.hash(plainPassword, 12);
};

const comparePassword = async (plainPassword: string, hashedPassword: string) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const PasswordUtils = {
  hashPassword,
  comparePassword
};