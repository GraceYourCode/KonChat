import Post from "@/models/post";
import Reply from "@/models/reply";
import { connectToDB } from "@/utils/database";
import { INewReply } from "@/utils/types";

export const POST = async (req: Request) => {
  const { userId, content, likes, dateCreated, postId, replyingTo }: INewReply = await req.json();

  try {
    await connectToDB();

    const newReply = await new Reply({
      creator: userId,
      content, 
      likes,
      dateCreated,
      postId,
      replyingTo,
    }).populate("creator");

    console.log(newReply);
    await newReply.save();
    
    const post = await Post.findById(postId);
      if(!post) return new Response (JSON.stringify("Post not found!"));

    post.replies.push(newReply);
    await post.save();

    return new Response(JSON.stringify(newReply));
  } catch (error: any) {
    return new Response(JSON.stringify(error.message));
  }
}
