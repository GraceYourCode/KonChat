import Post from "@/models/post";
import Reply from "@/models/reply";
import { connectToDB } from "@/utils/database";
import { IPost } from "@/utils/types";
import { Schema } from "mongoose";

export const POST = async (req: Request, { params }: { params: any }) => {
  const userId: Schema.Types.ObjectId = await req.json();

  try {
    await connectToDB();

    // get the post from either the post or reply collection in the database which is to be updated.
    const existingPost = await Post.findById(params.id).populate("creator").populate({
      path: "replies",
      populate: {
        path: "creator",
        model: "Users",
      }
    }) ||
      await Reply.findById(params.id).populate("creator");

    if (!existingPost) return new Response(JSON.stringify("Post not found!"))


    if (!existingPost.usersThatLiked.includes(userId)) {
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

    const postToUpdate = await Post.findById(params.id).populate("creator") || await Reply.findById(params.id).populate("creator");

    if (!postToUpdate) return new Response(JSON.stringify("Post not found!!"))

    postToUpdate.content = content;

    await postToUpdate.save();

    return new Response(JSON.stringify(postToUpdate))

  } catch (error: any) {
    return new Response(JSON.stringify(error.message))
  }
}

export const DELETE = async (req: Request, { params }: {params: any}) => {
  try {
    await connectToDB();

    const postToDelete = await Post.findByIdAndDelete(params.id) || await Reply.findByIdAndDelete(params.id);

    if (!postToDelete) return new Response(JSON.stringify("Post not found!!"))

      if ("postId" in postToDelete) {
        const post = await Post.findById(postToDelete.postId);
        post.replies = post.replies.filter((reply: any) => reply.toString() !== postToDelete._id.toString())
        console.log(post)
        await post.save();
      } else await Reply.deleteMany({postId: postToDelete._id})

    return new Response(JSON.stringify(postToDelete))
  } catch (error: any) {
    return new Response(JSON.stringify(error.message))
  }
}

export const GET = async (req: Request, {params}: {params: any}) => {
  try {
    await connectToDB();

    await Reply.find({});
    const post: IPost = await Post.findById(params.id).populate("creator").populate({
      path: "replies",
      populate: {
        path: "creator",
        model: "Users",
      }
    }).sort({likes: -1});


    return new Response(JSON.stringify(post));
  } catch (error: any) {
    return new Response(JSON.stringify(error.message));
  }
}