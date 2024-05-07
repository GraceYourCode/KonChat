import { IReply } from "@/utils/types";
import mongoose, { Schema, model, models } from "mongoose";

const replySchema = new Schema<IReply> ({
  creator: {
    type: Schema.Types.ObjectId,
    required: [true, "The Creator of this reply is required!"],
    ref: "Users",
  },
  content: {
    type: String,
    required: [true, "The content of this reply is required as reply cannot be empty"],
  },
  likes: {
    type: Number,
    required: [true, "The number of likes is required!"]
  },
  dateCreated: {
    type: Date,
    required: [true, "The date the reply was created is required!"],
  },
  postId: {
    type: Schema.Types.ObjectId,
    required: [true, "the postId is required"],
    ref: "Post",
  },
  replyingTo: {
    type: String,
    required: [true, "The user this reply is replying to is required!"]
  },
  usersThatLiked: [{
    type: Schema.Types.ObjectId,
    ref: "Users",
  }],
})
const Reply = models.Reply || model<IReply> ("Reply", replySchema);

export default Reply;