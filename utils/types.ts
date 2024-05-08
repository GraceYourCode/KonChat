import { Schema } from "mongoose";
import { Session } from "next-auth";
import { ReactNode } from "react";

export interface IReply extends Document {
  creator: Schema.Types.ObjectId,
  content: string,
  likes: number,
  dateCreated: Date,
  postId: Schema.Types.ObjectId,
  replyingTo: string,
  usersThatLiked: Schema.Types.ObjectId[],
}

export interface IPost extends Document {
  creator: Schema.Types.ObjectId,
  content: string,
  likes: number,
  dateCreated: Date,
  replies: Schema.Types.ObjectId[],
  usersThatLiked: Schema.Types.ObjectId[],
}

export interface IUser extends Document {
  email: string;
  username: string;
  image?: string;
}

export interface IProvider {
  children: ReactNode;
}

export interface IDateAPIResponse {
  "abbreviation": string,
  "client_ip": string,
  "datetime": string,
  "day_of_week": number,
  "day_of_year": number,
  "dst": boolean,
  "dst_from": null | any,
  "dst_offset": number,
  "dst_until": null | any,
  "raw_offset": number,
  "timezone": string,
  "unixtime": number,
  "utc_datetime": string,
  "utc_offset": string,
  "week_number": number
}

export interface INewPost {
  userId: Schema.Types.ObjectId,
  content: string,
  likes: number,
  dateCreated: Date,
}

export interface INewReply {
  userId: Schema.Types.ObjectId;
  content: string;
  likes: number;
  dateCreated: Date;
  postId: Schema.Types.ObjectId;
  replyingTo: string;
}

export interface IButtonProps {
  desktop?: boolean;
  type: string;
  click: () => void;
}

export interface IPostProps {
  content: string;
  creator: {
    _id: Schema.Types.ObjectId;
    email: string;
    username: string;
    image: string;
  };
  dateCreated: Date;
  likes: number;
  replies: Array<IReplyProps | null>;
  usersThatLiked: Array<Schema.Types.ObjectId | null>;
  _id: Schema.Types.ObjectId;
}

export interface IReplyProps {
  content: string;
  creator: {
    _id: Schema.Types.ObjectId;
    email: string;
    username: string;
    image: string;
  };
  dateCreated: Date;
  likes: number;
  postId: Schema.Types.ObjectId;
  replyingTo: string;
  usersThatLiked: Array<Schema.Types.ObjectId | null>;
  _id: Schema.Types.ObjectId;
}

export interface IIdentifierProps {
  image: string;
  username: string;
  dateCreated: string;
}

export interface IReplyState {
  id: string;
  postId?: string;
  username?: string;
  show: boolean;
}