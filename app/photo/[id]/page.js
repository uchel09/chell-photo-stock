
import { getPhotoById } from "@/actions/photoAction";
import ErrorComponent from "@/components/ui/Error/Error";
import PhotoDetail from "@/components/ui/PhotoDetail/PhotoDetail";
import React from "react";



const DetailPhotoPage = async ({ params: { id } }) => {
  const res = await getPhotoById(id);

  return <>
    {
        res?.message ? <ErrorComponent errMsg={res?.message}/>
        :<PhotoDetail photo={res?.data}/>
    }
  </>;
};

export default DetailPhotoPage;
