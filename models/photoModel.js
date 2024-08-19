import { Schema, model, models } from "mongoose";

const photoSchema = new Schema(
  {
    title: String,
    slug: String,
    publicId: String,
    imageUrl: String,
    imageName: String,
    blurHash: String,
    tags: [],
    public: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    favourite_users: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);

const PhotoModel = models.photos || model("photos", photoSchema);

export default PhotoModel;
