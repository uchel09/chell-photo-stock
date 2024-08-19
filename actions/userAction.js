"use server";

import UserModel from "@/models/userModel";
import { destroyFromCloudinary, uploadToCloudinary } from "@/utils/cloudinary";
import { revalidatePath } from "next/cache";

export async function getUserById({ myUser, id }) {
  try {
    if (myUser?._id === id) {
      return { user: myUser };
    }

    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      throw new Error("User does not exist!!!");
    }

    const newUser = {
      ...user._doc,
      _id: user?._id.toString(),
      total_followers: user?.followers.length,
      total_followings: user?.followings.length,
      followers: [],
      followings: [],
      isFollowing: user?.followers.includes(myUser?._id),
      myUserId: myUser?._id,
    };
    return {
      user: newUser,
    };
  } catch (error) {
    return { message: error.message };
  }
}

export async function updateUser({ formData, name, user }) {
  try {
    const files = formData.getAll("files");

    if (!files.length) {
      await UserModel.findByIdAndUpdate(user?._id, {
        name,
      });
    } else {
      const [res] = await uploadToCloudinary(files, user?._id);
      Promise.all([
        UserModel.findByIdAndUpdate(user?._id, {
          name,
          avatar: res?.secure_url,
          publicId: res?.public_id,
        }),
        destroyFromCloudinary(user?.publicId),
      ]);
    }

    revalidatePath("/");
    return { successMessage: "Update Success" };
  } catch (error) {
    return {
      message: "update user failed or internal server error",
    };
  }
}

export async function followUser({ myUserId, _id, isFollowing }) {
  try {
    if (isFollowing) {
      await Promise.all([
        UserModel.findByIdAndUpdate(myUserId, {
          $pull: { followings: _id },
        }),
        UserModel.findByIdAndUpdate(_id, {
          $pull: { followers: myUserId },
        }),
      ]);
    } else {
      await Promise.all([
        UserModel.findByIdAndUpdate(myUserId, {
          $push: { followings: _id },
        }),
        UserModel.findByIdAndUpdate(_id, {
          $push: { followers: myUserId },
        }),
      ]);
    }

    revalidatePath("/");
    return {
      successMessage: "Follow Success!",
    };
  } catch (error) {
    return {
      message: "failed to follow, Internal server error",
    };
  }
}
