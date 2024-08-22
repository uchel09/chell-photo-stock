"use client";
import Link from "next/link";
import "./PhotoDetail.css";
import React, {
  useState,
  experimental_useOptimistic as useOptimistic,
} from "react";
import Image from "next/image";
import formatNumber from "@/utils/formatNumber";
import { handleDownLoadImage } from "@/utils/downloadImage";
import { signIn } from "next-auth/react";
import { favouritePhoto } from "@/actions/photoAction";
import toast from "react-hot-toast";
const PhotoDetail = ({ photo, setPhotos, type }) => {
  const [isFavourite, setIsFavourite] = useState(photo?.isFavourite);
  const [zoom, setZoom] = useState(false);

  const handleFavoritePhoto = async () => {
    if (!photo.myUserId) {
      return signIn("google");
    }

    if (setPhotos) {
      const newPhoto = { ...photo, isFavourite: !photo?.isFavourite };
      setPhotos((photos) =>
        photos.map((item) => (item._id === newPhoto?._id ? newPhoto : item))
      );
      setIsFavourite(!photo?.isFavourite);
    } else {
      setIsFavourite((prev) => !prev);
    }

    const res = await favouritePhoto(photo);

    toast.success(
      `${photo.isFavourite ? "Photo Unfavorited" : "Photo Favorited"}`,
      { position: "bottom right" }
    );
    if (res?.message) {
      toast.error(res?.message);
    }
  };

  return (
    <div className={`container ${type}`}>
      <div className="p_d_header">
        <Link href={`/profile/${photo?.user?._id}`} className="p_d_author">
          <div className="avatar">
            <Image
              src={photo?.user?.avatar}
              alt={photo?.user?.name}
              width={40}
              height={40}
              sizes="25vw"
            />
          </div>
          <span>{photo?.user?.name}</span>
        </Link>

        <div className="p_d_btns">
          {type ? (
            <Link
              href={`/photo/${photo?._id}?s=${photo?.slug}`}
              className="btn btn_icon"
            >
              <i
                className="material-symbols-outlined"
                style={{ color: "#00b7ff" }}
              >
                share
              </i>
            </Link>
          ) : null}

          <button
            className="btn btn_icon"
            type="button"
            onClick={handleFavoritePhoto}
          >
            {isFavourite ? (
              <i
                className="material-symbols-outlined"
                style={{
                  color: "red",
                  border: "solid 1px red",
                  borderRadius: "10px",
                }}
              >
                heart_check
              </i>
            ) : (
              <i className="material-symbols-outlined">favorite</i>
            )}
          </button>
          <button
            type="button"
            className="btn btn_icon"
            onClick={() => handleDownLoadImage(photo)}
          >
            Download
          </button>
        </div>
      </div>

      <div className="p_d_photo">
        <div
          className={`p_d_photo_box ${zoom ? "zoom" : ""}`}
          onClick={() => setZoom((z) => (z = !z))}
        >
          <Image
            src={photo?.imageUrl}
            alt={photo?.title}
            width={340}
            height={340}
            sizes="40vw"
            placeholder="blur"
            blurDataURL={photo?.blurHash}
          />
          <i className="material-symbols-outlined">
            {zoom ? "zoom_in_map" : "zoom_out_map"}
          </i>
        </div>
      </div>

      <div className="p_d_footer">
        <h3 className="">{photo?.title}</h3>
        <div className="favorite">
          <i className="material-symbols-outlined">favorite</i>
          <span>{formatNumber(photo?.total_favourite)}</span>
        </div>
        <div className="published">
          <i className="material-symbols-outlined">date_range</i>
          <span>{new Date(photo?.createdAt).toDateString()}</span>
        </div>
        <div className="p_d_tags">
          {photo?.tags?.map((tag, index) => (
            <Link key={index} href={`/search/photos/${tag}`}>
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
