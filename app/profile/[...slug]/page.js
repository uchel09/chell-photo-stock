import ProfileInfo from "@/components/ui/Profile/Info";
import getServerUser from "@/utils/getServer";
import React from "react";

const ProfilePage = async ({ params: { slug } }) => {
  const id = slug[0],
    page = slug[1] || "public";
  const myUser = await getServerUser();

  return (
    <>
      <ProfileInfo myUser={myUser} id={id} />
    </>
  );
};

export default ProfilePage;
