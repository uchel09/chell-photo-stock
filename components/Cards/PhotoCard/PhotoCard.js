import Image from "next/image";
import "./PhotoCard.css";

import React from "react";
import Link from "next/link";
import { handleDownLoadImage } from "@/utils/downloadImage";
import { signIn } from "next-auth/react";
import { favouritePhoto } from "@/actions/photoAction";
import toast from "react-hot-toast";

const PhotoCard = React.memo(({ photo, setPhotos, index }) => {
  const handleFavoritePhoto = async () => {
    if (!photo.myUserId) {
      return signIn("google");
    }

    const newPhoto = { ...photo, isFavourite: !photo.isFavourite };

    setPhotos((photos) =>
      photos.map((item) => (item._id === newPhoto?._id ? newPhoto : item))
    );

    const res = await favouritePhoto(photo);

    toast.success(`${photo.isFavourite?"Photo Unfavorited":"Photo Favorited"}`,{position:"bottom right"})
    if (res?.message) {
      toast.error(res?.message);
    }
  };

  const seePhoto =()=>{
    console.log(photo?.user)
  }

  return (
    <div className="photo_card" onClick={seePhoto}>
      <Image
        src={photo?.imageUrl}
        alt={photo?.title}
        width={280}
        height={280}
        sizes="60vw"
        placeholder="blur"
        blurDataURL={photo?.blurHash}
      />

      <div className="p_c_top">
        {photo?.myUserId === photo?.user._id ? (
          <>
            <button className="btn p_c_btn">
              <i className="material-symbols-outlined">delete</i>
            </button>
            <button className="btn p_c_btn">
              <i className="material-symbols-outlined" style={{}}>
                edit
              </i>
            </button>
          </>
        ) : null}
        <button className="btn p_c_btn" onClick={handleFavoritePhoto}>
          {photo?.isFavourite ? (
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
      </div>

      <div className="p_c_bottom">
        <Link
          href={`/profile/${photo?.user?._id}`}
          className="author"
          title={photo?.user?.name}
        >
          <div className="avatar">
            <Image
              src={photo?.user?.avatar}
              alt={photo?.user?.name}
              width={40}
              height={40}
              sizes="25vw"
            />
          </div>
          <span className="text-ellipsis">{photo?.user?.name}</span>
        </Link>

        <button
          className="btn p_c_btn"
          onClick={() => handleDownLoadImage(photo)}
        >
          <i className="material-symbols-outlined">download</i>
        </button>
      </div>

      <button className="btn p_c_btn_overflow" />
    </div>
  );
});

export default PhotoCard;
