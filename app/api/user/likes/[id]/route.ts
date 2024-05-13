import Post from "@/models/post";
import Reply from "@/models/reply";
import { connectToDB } from "@/utils/database"
import mongoose from "mongoose";

export const GET = async (req: Request, { params }: { params: any }) => {
  try {
    await connectToDB();

    const userId = new mongoose.Types.ObjectId(params.id as string)

    const userReplies = await Reply.find({ usersThatLiked: userId }).populate("creator");
    const userPosts = await Post.find({usersThatLiked: userId}).populate("creator");

    console.log(userReplies, userPosts);

    return new Response (JSON.stringify([...userReplies, ...userPosts]));
  } catch (error: any) {
    return new Response (JSON.stringify(error.message));
  }
}