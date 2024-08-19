"use server";

import getServerUser from "./getServer";
import { Types } from "mongoose";

// Photos pipeline
export async function generatePhotosPipeline({ sort, limit, match }) {
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
      $lookup: {
        from: "users", // Nama koleksi yang akan digabungkan
        let: { user_id: "$user" }, // Variabel lokal yang didefinisikan untuk digunakan dalam pipeline
        pipeline: [
          // Pipeline agregasi untuk koleksi yang digabungkan
          { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } }, // Menggunakan $expr untuk membandingkan ID pengguna
          { $project: { name: 1, avatar: 1 } }, // Memilih hanya field name dan avatar
        ],
        as: "user", // Nama field baru dalam hasil yang akan berisi hasil lookup
      },
    },
    {
      $unwind: "$user",
    },
    {
      $addFields: {
        isFavourite: {
          $cond: [{ $in: [userId, "$favourite_users"] }, true, false],
        },
        total_favourite: { $size: "$favourite_users" },
        myUserId: userId,
      },
    },
    {
      $project: {
        favourite_users: 0, // exclude favorite_users field
      },
    },
  ];

  return base_pipeline;
}
