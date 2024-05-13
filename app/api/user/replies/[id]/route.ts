import Reply from "@/models/reply";
import { connectToDB } from "@/utils/database"
import mongoose from "mongoose";

export const GET = async (req: Request, { params }: { params: any }) => {
  try {
    await connectToDB();

    const userId = new mongoose.Types.ObjectId(params.id as string)

    const userReplies = await Reply.find({ creator: userId }).populate("creator");

    console.log(userReplies);

    return new Response (JSON.stringify(userReplies));
  } catch (error: any) {
    return new Response (JSON.stringify(error.message));
  }
}