import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();
 const authOptions=
{
  providers: [
    CredentialsProvider({
      name: "Login",

      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials:any) {
        if (!credentials) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        });

        if (!user) {
          console.error("User not found");
          return null;
        }
        const match_password = await bcrypt.compare(
          credentials?.password,
          user.password
        );
        if (!match_password) {
          console.error("password not match");
          return null;
        }
        console.log("User authenticated:", user);
        return {
          id: user.id,
          name: user.username,
        };
      },
    }),
  
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt: async ({ user, token }: any) => {
      if(user){
        token.uid=user.id;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: async ({ session, token }:any) => {
      if(session.user)
      session.user.id = token.uid; // Attach user ID to the session
      return session;
    },
  },
};
const handler=NextAuth(authOptions);
 export {handler as GET,handler as POST};
