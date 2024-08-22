import { getPhotos } from "@/actions/photoAction";
import "./Gallery.css";
import React from "react";
import ErrorComponent from "../../Error/Error";
import Gallery from "@/components/ui/Gallery/Gallery";

const ProfileGallery = async ({ id, page, myUserId }) => {
  const pages = ["public", "private", "favorite"];
  if (!pages.includes(page)) return null;

  page = id === myUserId ? page : "public";



  const sort = page === "favorite" ? "upatedAt" : "_id";
  const res = await getPhotos({ id, sort, page });

  return (
    <>
      {res?.message ? (
        <ErrorComponent errMsg={res?.message} />
      ) : (
        <Gallery
          data={res?.data}
          next_cursor={res?.next_cursor}
          fetchingData={getPhotos}
          query={{ id, sort, page }}
        />
      )}
    </>
  );
};

export default ProfileGallery;
