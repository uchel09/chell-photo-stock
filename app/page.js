import { getPhotos } from "@/actions/photoAction";
import ErrorComponent from "@/components/ui/Error/Error";
import Gallery from "@/components/ui/Gallery/Gallery";
import Header from "@/components/ui/Header/Header";
import React from "react";

const HomePage = async () => {
  const res = await getPhotos({ page: "home" });

  return (
    <>
      <Header />
      {res?.message ? (
        <ErrorComponent errMsg={res?.message} />
      ) : (
        <Gallery
          data={res?.data}
          next_cursor={res?.next_cursor}
          fetchingData={getPhotos}
          query={{ page: "home" }}
        />
      )}
    </>
  );
};

export default HomePage;
