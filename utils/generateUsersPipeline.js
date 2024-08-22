"use server";

import getServerUser from "./getServer";
import { Types } from "mongoose";

// Users pipeline
export async function generateUsersPipeline({ sort, limit, match, search }) {
  const user = await getServerUser();

  const userId = user ? new Types.ObjectId(user?._id) : undefined;
  const base_pipeline = [
    {
      $sort: sort === "_id" ? { _id: -1 } : { updatedAt: -1 },
    },
    {
      $match: match,
    },
    {
      $limit: limit,
    },

    {
      $addFields: {
        isFollowing: {
          $cond: [{ $in: [userId, "$followers"] }, true, false],
        },
        myUserId: userId,
      },
    },
    {
      $project: {
        followings: 0,
        followers: 0,
      },
    },
  ];
const search_pipeline = [
    {
      $match: {
        name: { $regex: search, $options: "i" },
      },
    },
  ];


  if (search) {
    return [...search_pipeline, ...base_pipeline];
  }

  return base_pipeline;
}

export async function generateUsersCountPipeline({ match, search }) {
  const base_pipeline = [{ $match: match }, { $count: "total" }];
  const search_pipeline = [
    {
      $match: {
        name: { $regex: search, $options: "i" },
      },
    },
  ];

  if (search) {
    return [...search_pipeline, ...base_pipeline];
  }
}
