import { User } from '@prisma/client';
import prisma from 'utils/prisma';

export default async function getUserCategories(user: User) {
  return await prisma.category.findMany({
    where: {
      authorId: user?.id,
    },
    include: {
      links: {
        where: {
          authorId: user?.id,
        },
        include: {
          category: true,
        },
      },
    },
  });
}
