import prisma from "utils/prisma";

export default async function getUserByEmail(email: string = "") {
  if (!email) {
    return null;
  }
  return await prisma.user.findFirst({
    where: {
      email,
    },
  });
}
