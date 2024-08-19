"use client";
import { uploadPhoto } from "@/actions/photoAction";
import UploadCard from "@/components/Cards/UploadCard/UploadCard";
import UploadForm from "@/components/forms/UploadForm/UploadForm";
import React, { useState, useMemo } from "react";

import Loading from "@/components/ui/Loading/Loading";
import toast from "react-hot-toast";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const count = useMemo(() => {
    return files.filter((file) => file.status === "success").length;
  }, [files]);

  const handleUpload = async () => {
    const filesUpload = files.filter((file) => file?.status === "success");
    const formData = new FormData();
    filesUpload.forEach((file) => {
      formData.append("files", file.fileUpload);
      if (!file.title) {
        file.title = file.name.replace(/.(jpeg|jpg|png)$/gi, "");
      }
    });

    const newFile = filesUpload.map((file) => ({
      ...file,
      fileUpload: "",
      imageUrl: "",
    }));
    setLoading(true);
    // Upload photo to cloudinary
    const res = await uploadPhoto(formData, newFile);

    setLoading(false);
    if (res?.message) {
      toast.error(res.message);
    }


    files.map((file) => URL.revokeObjectURL(file.imageUrl));
    setFiles([]);
    toast.success("Image Uploaded successfully")
  };

  return (
    <div className="container">
      <UploadForm setFiles={setFiles} />
      <div className="masonry">
        {files.map((file, index) => {
          return (
            <UploadCard
              key={index}
              file={file}
              setFiles={setFiles}
              index={index}
            />
          );
        })}
      </div>
      <button
        className="btn_submit"
        style={{ margin: "20px 0" }}
        disabled={count <= 0 || count > 5 || loading}
        onClick={handleUpload}
      >
        {loading
          ? "Loading..."
          : count
          ? `submit ${count} photos`
          : "submit to chell"}
      </button>

      {loading ? <Loading /> : null}
    </div>
  );
};

export default Upload;
