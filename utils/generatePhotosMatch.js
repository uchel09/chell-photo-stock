// PhotosMatch

import { Types } from "mongoose";

export function generatePhotosMatch(query) {
  const page = query?.page;
  const next = query?.next;

  const paginate_id = {
    _id: next ? { $lt: new Types.ObjectId(next) } : { $exists: true },
  };

  const paginate_updatedAt = {
    updatedAt: next ? { $lt: new Date(next) } : { $exists: true },
  };

  if (page === "home") {
    return { public: true, ...paginate_id };
  }
}
