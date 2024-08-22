"use server";

import PhotoModel from "@/models/photoModel";
import { destroyFromCloudinary, uploadToCloudinary } from "@/utils/cloudinary";
import { dynamicBlurDataUrl } from "@/utils/dynamicBlurDataUrl";
import { genrateNextCursor } from "@/utils/generateNextCursor";
import { generatePhotosMatch } from "@/utils/generatePhotosMatch";
import {
  generatePhotosPipeline,
  generatePhotosCountPipeline,
} from "@/utils/generatePhotosPipeline ";
import getServerUser from "@/utils/getServer";
import { slugify } from "@/utils/slugify";
import { revalidatePath } from "next/cache";

export async function uploadPhoto(formData, filesUpload) {
  try {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const files = formData.getAll("files");

    //Upload to cloudinary
    const photos = await uploadToCloudinary(files, user?._id);

    //Generate blurDataUrl

    const blurDataPromise = photos.map((photo) =>
      dynamicBlurDataUrl(photo.secure_url)
    );
    const blurData = await Promise.all(blurDataPromise);

    const newPhotos = photos.map((photo, index) => ({
      user: user?._id,
      publicId: photo.public_id,
      imageUrl: photo.secure_url,
      title: filesUpload[index].title,
      tags: filesUpload[index].tags,
      slug: slugify(filesUpload[index].title),
      imageName: `${slugify(filesUpload[index].title)}.${photo.format}`,
      public: filesUpload[index].public,
      blurHash: blurData[index],
    }));

    await PhotoModel.insertMany(newPhotos);
    revalidatePath("/");
    return {
      messsage: "Upload Success",
    };
  } catch (error) {
    return {
      message: error.message,
    };
  }
}

export async function getPhotos(query) {
  try {
    const search = query?.search;
    const limit = query?.limit * 1 || 5;
    const sort = query?.sort || "_id";
    const match = generatePhotosMatch(query);

    const pipeline = await generatePhotosPipeline({
      sort,
      limit,
      match,
      search,
    });

    const photos = JSON.parse(
      JSON.stringify(await PhotoModel.aggregate(pipeline))
    );

    const next_cursor = genrateNextCursor({ sort, limit, data: photos });

    return { data: photos, next_cursor };
  } catch (error) {
    return { message: error.message };
  }
}
export async function favouritePhoto({ myUserId, _id, isFavourite }) {
  try {
    if (isFavourite) {
      await PhotoModel.findByIdAndUpdate(_id, {
        $pull: { favourite_users: myUserId },
      });
    } else {
      await PhotoModel.findByIdAndUpdate(_id, {
        $push: { favourite_users: myUserId },
      });
    }
    revalidatePath("/");
  } catch (error) {
    return {
      message: error.message,
    };
  }
}

export async function getPhotosCount(query) {
  try {
    const search = query?.search;
    const match = generatePhotosMatch(query);
    const pipeline = await generatePhotosCountPipeline({ match, search });

    const [result] = JSON.parse(
      JSON.stringify(await PhotoModel.aggregate(pipeline))
    );

    return result?.total || 0;
  } catch (error) {
    return {
      message: error?.message,
    };
  }
}

export async function updatePhoto(photo) {
  try {
    await PhotoModel.findByIdAndUpdate(photo?._id, {
      title: photo?.title,
      tags: photo?.tags,
      public: photo?.public,
    });

    revalidatePath("/");

    return {
      successMessage: "Update Success",
    };
  } catch (error) {
    return {
      message: error.message,
    };
  }
}
export async function deletePhoto({ _id, publicId }) {
  try {
    await destroyFromCloudinary(publicId);

    await PhotoModel.findByIdAndDelete(_id);
    revalidatePath("/");

    return {
      successMessage: "Delete Success",
    };
  } catch (error) {
    return {
      message: error.message,
    };
  }
}

export async function getPhotoById(id) {
  try {
    const [myUser, photo] = await Promise.all([
      getServerUser(),
      PhotoModel.findById(id).populate("user", "name avatar"),
    ]);

    if(!photo){
      throw new Error("Photo does not exist")
    }

    const newPhoto ={
      ...photo._doc,
      isFavourite:photo?.favourite_users?.includes(myUser._id),
      total_favourite:photo?.favourite_users?.length,
      favourite_users:[],
      myUserId:myUser?._id
    }
    return {
      data: JSON.parse(JSON.stringify(newPhoto))
    }

  } catch (error) {
    return {
      message: error?.message,
    };
  }
}
