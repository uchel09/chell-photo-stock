"use server";

import UserModel from "@/models/userModel";
import { destroyFromCloudinary, uploadToCloudinary } from "@/utils/cloudinary";
import { revalidatePath } from "next/cache";
import { generateUsersMatch } from "@/utils/generateUsersMatch";
import { generateUsersPipeline,generateUsersCountPipeline } from "@/utils/generateUsersPipeline";
import { genrateNextCursor } from "@/utils/generateNextCursor";

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
    const isuserExist = await UserModel.findOne({ name });
    if (isuserExist && !files.length) {
      if (user._id === isuserExist._id.toString()) {
        return {
          successMessage: "Nothing changed",
        };
      }

      throw new Error("name already exist");
    }

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
      message: `${error.message}`,
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

export async function getUsers(query) {
  try {
    const search = query?.search;
    const limit = query?.limit * 1 || 5;
    const sort = query?.sort || "updatedAt";
    const match = generateUsersMatch(query);

    const pipeline = await generateUsersPipeline({
      sort,
      limit,
      match,
      search,
    });


    const users = JSON.parse(
      JSON.stringify(await UserModel.aggregate(pipeline))
    );

    const next_cursor = genrateNextCursor({ sort, limit, data: users });

    return { data: users, next_cursor };
  } catch (error) {
    return { message: error.message };
  }
}

export async function getUsersCount(query) {
  try {
    const search = query?.search;
    const match = generateUsersMatch(query);
    const pipeline = await generateUsersCountPipeline({ match, search });

    const [result] = JSON.parse(
      JSON.stringify(await UserModel.aggregate(pipeline))
    );

    return result?.total || 0;
  } catch (error) {
    return {
      message: error?.message,
    };
  }
}