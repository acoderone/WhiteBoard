import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import GithubProvider from 'next-auth/providers/github';
const prisma = new PrismaClient();

const authOptions = {
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

      async authorize(credentials) {
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

        const match_password = credentials?.password && user?.password
          ? await bcrypt.compare(credentials.password, user.password)
          : false;

        if (!match_password) {
          console.error("Password does not match");
          return null;
        }

        console.log("User authenticated:", user);
        return {
          id: user.id,
          name: user.username,
          email:user.email
        };
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,

    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }:any) {
      if (user) {
        // Handle user login with GitHub
        token.uid = user.id;
         const email=user?.email
         token.email=email
        // Check if the user's email exists in the database
        if(email){

        
        const existingUser = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!existingUser) {
          // Create a new user if the email does not exist
          await prisma.user.create({
            data: {
              email: user.email,
              username: user.email?.split("@")[0], // Set username based on the email's local part
              password: "", // GitHub login doesn't use a password
            },
          });
          console.log("New user created for GitHub login:", user.email);
        }
      }}
      return token;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }:any) {
      if (session.user) {
        session.user.id = token.uid; 
        session.user.email=token.email;
        
        // Attach user ID to the session
      }
      return session;
    },
    async redirect({
      url,baseUrl
    }){
      return baseUrl + '/boards'; 
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };