import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export async function createUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const accountNumber = generateAccountNumber();

  return await prisma.user.create({
    data: {
      email,
      passwordHash,
      accountNumber,
    },
  });
}

export async function verifyUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;

  return user;
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

function generateAccountNumber() {
  return "ACC" + Math.floor(1000 + Math.random() * 9000);
}
