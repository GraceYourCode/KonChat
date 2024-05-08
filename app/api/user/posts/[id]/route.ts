import Post from "@/models/post";
import { connectToDB } from "@/utils/database"
import mongoose from "mongoose";

export const GET = async (req: Request, {params}: {params: any}) => {
  try {
    await connectToDB();

    const userId = new mongoose.Types.ObjectId(params.id as string)

    const userPosts = await Post.find({creator: userId}).populate("creator")

    console.log(userPosts)

    return new Response (JSON.stringify(userPosts));
  } catch (error: any) {
    return new Response (JSON.stringify(error.message));
  }
}