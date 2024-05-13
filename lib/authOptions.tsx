import Users from "@/models/user";
import { connectToDB } from "@/utils/database";
import { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    })
  ],
  callbacks: {
    async session({ session }: { session:  Session}) {
      console.log(session);
      const sessionUser = await Users.findOne({
        email: session.user?.email,
      });

      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({user}: {user: User}) {
      try {
        await connectToDB();

        const userExists = await Users.findOne({
          email: user.email,
        });

        if (!userExists) {
          await Users.create({
            email: user.email,
            username: user.name.replace(" ", "").toLowerCase(),
            image: user.image,
            name: user.name,
            description: `I am ${user.name}. This is my profile.`,
          });
        }

        return true;
      } catch (error: any) {
        // throw error;
        return false;
      }
    },
  },
}
