import Post from "@/models/post";
import { connectToDB } from "@/utils/database";
import { INewPost } from "@/utils/types";

export const POST = async (req: Request) => {
  const { userId, content, likes, dateCreated }: INewPost = await req.json();

  try {
    await connectToDB();

    const newPost = await new Post ({
      creator: userId,
      content,
      likes, 
      dateCreated
    });
    console.log(newPost);

    await newPost.save();

    return new Response(JSON.stringify(newPost));
  } catch (error: any) {
    return new Response(JSON.stringify(error.message))
  }
}