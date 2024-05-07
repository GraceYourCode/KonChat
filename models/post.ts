import { IPost } from "@/utils/types";
import { Schema, model, models } from "mongoose";

const postSchema = new Schema<IPost> ({
  creator: {
    type: Schema.Types.ObjectId,
    required: [true, "The Creator of this post is required!"],
    ref: "Users",
  },
  content: {
    type: String,
    required: [true, "The content of this posts is required as post cannot be empty"],
  },
  likes: {
    type: Number,
    required: [true, "The number of likes is required!"]
  },
  dateCreated: {
    type: Date,
    required: [true, "The date the post was created is required!"],
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: "Reply"
  }],
  usersThatLiked: [{
    type: Schema.Types.ObjectId,
    ref: "Users"
  }],
})

const Post = models.Post || model<IPost>("Post", postSchema);

export default Post;
