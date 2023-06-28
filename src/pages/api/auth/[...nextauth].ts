import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import PATHS from "constants/paths";
import { MAX_AGE } from "constants/session";
import getUserByEmail from "lib/user/getUserByEmail";
import getUserOrThrow from "lib/user/getUserOrThrow";
import prisma from "utils/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const user = await getUserOrThrow(session);
      const accountCount = await prisma.user.count();
      if (accountCount === 1 && !user.is_admin) {
        console.warn(`[SESSION] Set user ${user.email} admin`);
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            is_admin: true,
            is_connection_allowed: true,
          },
        });
      }

      return user.is_connection_allowed ? session : false;
    },
    async signIn({ profile }) {
      const user = await getUserByEmail(profile.email);
      if (!user) {
        console.warn(
          `[AUTH] User ${profile.email} authentication rejected (user does not exist)`
        );
        return false;
      } else if (!user?.is_connection_allowed) {
        // If connection is not allowed, authentication is rejected
        // Admin must manually set "is_connection_allowed" to true if this is a new user
        console.warn(
          `[AUTH] User ${profile.email} authentication rejected (not allowed to login)`
        );
        return false;
      } else {
        // User exist and is allowed to connect, authentication success
        console.log(
          `[AUTH] User ${profile.email} authentication ${
            !user ? "success (created)" : "success"
          }`
        );
        return true;
      }
    },
  },
  pages: {
    signIn: PATHS.LOGIN,
    error: PATHS.LOGIN,
    signOut: PATHS.LOGOUT,
  },
  session: {
    maxAge: MAX_AGE,
  },
} as NextAuthOptions;
export default NextAuth(authOptions);
