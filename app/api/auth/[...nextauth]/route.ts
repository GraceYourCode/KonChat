import NextAuth from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export const GET = (req: NextApiRequest, res: NextApiResponse) => handler(req, res);
export const POST = (req: NextApiRequest, res: NextApiResponse) => handler(req, res);
