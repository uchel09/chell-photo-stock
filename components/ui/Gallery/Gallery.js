"use client";

import PhotoCard from "@/components/Cards/PhotoCard/PhotoCard";
import useInView from "@/hooks/useInView";
import React, { useEffect, useState } from "react";

const Gallery = ({ data, next_cursor, fetchingData, query }) => {
  const [files, setFiles] = useState(data);
  const [next, setNext] = useState(next_cursor);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  async function handleLoadMore() {
    if (next === "stop" || loading) return;
    setLoading(true);
    const res = await fetchingData({ next, ...query });

    const newData = [...files, ...res?.data];
    setFiles(newData);
    setNext(res?.next_cursor)

    setLoading(false);
  }

  useEffect(() => {
    if (inView) {
      handleLoadMore();
    }
  }, [inView]);

  return (
    <div className="container">
      <div className="masonry" style={{ margin: "40px auto" }}>
        {files.map((file, index) => (
          <PhotoCard
            key={index}
            photo={file}
            setPhotos={setFiles}
            index={index}
          />
        ))}
      </div>
      <button
        className="btn_submit"
        style={{
          margin: "20px auto",
          display: next && next !== "stop" ? "block" : "none",
        }}
        disabled={loading}
        onClick={handleLoadMore}
        ref={ref}
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
};

export default Gallery;
