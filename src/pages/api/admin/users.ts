import { boolean, number, object } from "yup";

import { apiHandler } from "lib/api/handler";
import prisma from "utils/prisma";

export default apiHandler(
  {
    put: editUser,
  },
  {
    isAdminHandler: true,
  }
);

const bodySchema = object({
  user_id: number().required("user_id must be a number"),
  is_connection_allowed: boolean().default(() => false),
}).typeError("Missing request Body");

async function editUser({ req, res, user }) {
  const { user_id, is_connection_allowed } = await bodySchema.validate(
    req.body
  );

  if (user.id === user_id) {
    throw new Error("You cannot edit yourself");
  }

  const userTarget = await prisma.user.findFirst({
    where: {
      id: user_id,
    },
  });
  if (!userTarget) {
    throw new Error("Unable to find user " + user_id);
  }

  const newUser = await prisma.user.update({
    where: {
      id: user_id,
    },
    data: {
      is_connection_allowed,
    },
  });

  return res.send({ success: "User successfully updated", user: newUser });
}
