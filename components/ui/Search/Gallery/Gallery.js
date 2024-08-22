import { getPhotos } from "@/actions/photoAction";
import React from "react";
import ErrorComponent from "@/components/ui/Error/Error";
import Gallery from "@/components/ui/Gallery/Gallery";

const SearchGallery = async ({ page, search, id }) => {
  if (page !== "photos" && page !== "private") return null;

  const res = await getPhotos({page, search,id})



  return (
    <>
      {res?.message ? (
        <ErrorComponent errMsg={res?.message} />
      ) : (
        <Gallery
          data={res?.data}
          next_cursor={res?.next_cursor}
          fetchingData={getPhotos}
          query={{page, search,id}}
        />
      )}
    </>
  );
};

export default SearchGallery;
