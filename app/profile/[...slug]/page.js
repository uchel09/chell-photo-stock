import ProfileInfo from "@/components/ui/Profile/Info";
import ProfileFollow from "@/components/ui/Profile/Follow/Follow";
import ProfileMenu from "@/components/ui/Profile/Menu/Menu";
import ProfileGallery from "@/components/ui/Profile/Gallery/Gallery";
import getServerUser from "@/utils/getServer";
import React from "react";

const ProfilePage = async ({ params: { slug } }) => {
  const id = slug[0],
    page = slug[1] || "public";
  const myUser = await getServerUser();

  return (
    <>
      <ProfileInfo myUser={myUser} id={id} />
      <ProfileFollow id={id} page={page} />
      <ProfileMenu id={id} page={page} myUserId={myUser?._id} />
      <ProfileGallery id={id} page={page} myUserId={myUser?._id} />
    </>
  );
};

export default ProfilePage;
