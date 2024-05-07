import Post from "@/models/post";
import Reply from "@/models/reply";
import { connectToDB } from "@/utils/database";
import { Schema } from "mongoose";

export const POST = async (req: Request, { params }: { params: any }) => {
  const { userId, like } = await req.json();

  try {
    await connectToDB();

    // get the post from either the post or reply collection in the database which is to be updated.
    const existingPost = await Post.findById(params.id).populate("creator") ||
      await Reply.findById(params.id).populate("creator");

    if (!existingPost) return new Response(JSON.stringify("Post not found!"))


    if (like === "like") {
      existingPost.likes = existingPost.likes + 1;
      existingPost.usersThatLiked = [...existingPost.usersThatLiked, userId]
    } else {
      existingPost.likes = existingPost.likes - 1;
      existingPost.usersThatLiked = existingPost.usersThatLiked.filter((user: Schema.Types.ObjectId) => user.toString() !== userId.toString())
    }

    await existingPost.save();

    return new Response(JSON.stringify(existingPost));
  } catch (error: any) {
    console.log(error)
    return new Response(JSON.stringify(error.message));
  }
}

export const PATCH = async (req: Request, { params }: { params: any }) => {
  const content = await req.json();
  console.log(params)

  try {
    await connectToDB();

    const postToUpdate = await Post.findById(params.id) || await Reply.findById(params.id);

    if (!postToUpdate) return new Response(JSON.stringify("Post not found!!"))

    postToUpdate.content = content;

    await postToUpdate.save();

    return new Response(JSON.stringify(postToUpdate))

  } catch (error: any) {
    return new Response(JSON.stringify(error.message))
  }
}

export const DELETE = async (req: Request, { params }: {params: any}) => {
  console.log(params)
  try {
    await connectToDB();

    const postToDelete = await Post.findByIdAndDelete(params.id) || await Reply.findByIdAndDelete(params.id);

    if (!postToDelete) return new Response(JSON.stringify("Post not found!!"))

    return new Response(JSON.stringify(postToDelete))
  } catch (error: any) {
    return new Response(JSON.stringify(error.message))
  }
}