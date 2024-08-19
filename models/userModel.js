import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    publicId: {
      type: String,
    },
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);

const UserModel = models.users || model("users", userSchema);

export default UserModel;
