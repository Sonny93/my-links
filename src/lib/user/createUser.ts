import { Profile } from "next-auth";
import prisma from "utils/prisma";

export default async function createUser({ email, image, name }: Profile) {
  if (!email) {
    throw new Error("Email missing");
  }

  return await prisma.user.create({
    data: {
      name,
      email,
      image,
    },
  });
}
