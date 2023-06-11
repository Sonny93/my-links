import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import PATHS from "constants/paths";
import { MAX_AGE } from "constants/session";
import getUserByEmail from "lib/user/getUserByEmail";
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
    async signIn({ profile }) {
      const user = await getUserByEmail(profile.email);
      const accountCount = await prisma.user.count();

      if (!user && accountCount > 0) {
        // If user does not exist, authentication rejected
        console.warn(`[AUTH] User ${profile.email} authentication rejected`);
        return false;
      } else if (user || (!user && accountCount === 0)) {
        // No user in databse or user exist, authentication success
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
