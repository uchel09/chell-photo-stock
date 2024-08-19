import path from "path";
import fs from "fs/promises";
import os from "os";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function savePhotosToLocal(files) {
  const multipleBufferPromise = files.map((file) =>
    file.arrayBuffer().then((data) => {
      const buffer = Buffer.from(data);
      const random = crypto.randomUUID();
      const ext = file.type.split("/")[1];
      const filename = file.name.replace(/.(jpeg|jpg|png)$/gi, "");
      const userDocumentsDir = path.join(os.homedir(), "Documents/myApp");
      const uploadDir = path.join(
        userDocumentsDir,
        `/${filename + "-" + random}.${ext}`
      );
      fs.writeFile(uploadDir, buffer);
      return {
        filepath: uploadDir,
      };
    })
  );

  return await Promise.all(multipleBufferPromise);
}

export async function uploadToCloudinary(files, userID) {
  const newFile = await savePhotosToLocal(files);
  const multiplePhotosPromise = newFile.map((file) =>
     cloudinary.uploader.upload(file.filepath, {
      folder: `next-myPhoto/${userID}`,
    })
  );

  const results = await Promise.all(multiplePhotosPromise);
  newFile.map((file) => fs.unlink(file.filepath));

  return results;
}

export async function destroyFromCloudinary(public_id) {
  try {
    if (public_id) {
     await cloudinary.uploader.destroy(public_id);
    }
  } catch (error) {
    console.log(error);
  }
}
