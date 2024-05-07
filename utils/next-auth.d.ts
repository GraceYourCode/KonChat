import { Schema } from "mongoose";
import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      id: Schema.Types.ObjectId;
    };
    expires: ISODateString
  }

  interface User {
  name: string,
  email: string,
  image: string,
  }
}