import { IUser } from "@/utils/types";
import { Schema, model, models } from "mongoose";

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required!"],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required!"],
  },
  image: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Name is required!"]
  },
  description: {
    type: String,
    required: [true, "description is required!"]
  }
})

const Users = models.Users || model<IUser>("Users", userSchema);

export default Users;