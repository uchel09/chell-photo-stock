import { getUserById } from "@/actions/userAction";
import "./Info.css";
import React from "react";
import ErrorComponent from "@/components/ui/Error/Error";
import Info from "./Info";

const ProfileInfo = async ({ myUser, id }) => {
  const res = await getUserById({ myUser, id });
(res)

  return (
    <> {res?.message ? <ErrorComponent errMsg={res?.message} /> : <Info user={res?.user}/>}</>
  );
};

export default ProfileInfo;
