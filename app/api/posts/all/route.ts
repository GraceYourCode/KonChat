import Post from "@/models/post";
import { connectToDB } from "@/utils/database"
import { IPost } from "@/utils/types";

export const GET = async () => {
  try {
    await connectToDB();

    const allPosts: IPost[] = await Post.find().populate("creator").populate({
      path: "replies",
      populate: {
        path: "creator",
        model: "Users",
      }
    }).sort({likes: -1});


    return new Response(JSON.stringify(allPosts));
  } catch (error: any) {
    return new Response(JSON.stringify(error.message));
  }
}