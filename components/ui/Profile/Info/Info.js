"use client";
import formatNumber from "@/utils/formatNumber";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ModalComponent from "../../Modal/Modal";
import ProfileEdit from "../Edit/Edit";
import { signIn, signOut } from "next-auth/react";
import { followUser } from "@/actions/userAction";

const Info = ({ user }) => {
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing);
  const [totalFollowers, setTotalFollowers] = useState(user?.total_followers);
  const [isEdit, setIsEdit] = useState(false);
  const handleFollow = async () => {
    if (!user?.myUserId) {
      return signIn("google");
    }
     setIsFollowing((prev) => !prev);
    setTotalFollowers((prev) => (isFollowing ? prev - 1 : prev + 1));
     await followUser({ ...user, isFollowing });
  };

  return (
    <div className="profile_info container">
      <div className="p_i_info">
        <div className="avatar">
          <Image
            src={user?.avatar}
            alt={user?.name}
            width={100}
            height={100}
            sizes="50vw"
            priority
          />
        </div>

        <div className="p_i_text">
          <h1 className="text-ellipsis" title={user?.name}>
            {user?.name}
          </h1>
          <h2 className="text-ellipsis" title={user?.email}>
            {user?.email}{" "}
          </h2>
          <div className="p_i_text_btns">
            {user?.my_user ? (
              <>
                <button
                  className="btn btn_icon"
                  onClick={() => setIsEdit(true)}
                >
                  <i className="material-symbols-outlined">settings</i>
                  <span>Edit</span>
                </button>
                <button onClick={signOut} className="btn btn_icon">
                  <i className="material-symbols-outlined">logout</i>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button className="btn btn_icon" onClick={handleFollow}>
                <i className="material-symbols-outlined">
                  {isFollowing ? "check_circle" : "add_circle"}
                </i>
                <span>{isFollowing ? "following" : "follow"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p_i_count">
        <Link href={`/profile/${user?._id}/following`}>
          <strong>{formatNumber(user?.total_followings)}</strong>
          <span>Followings</span>
        </Link>
        <Link href={`/profile/${user?._id}/follower`}>
          <strong>{formatNumber(totalFollowers)}</strong>
          <span>followers</span>
        </Link>
      </div>

      {isEdit !== false && user?.my_user ? (
        <ModalComponent open={setIsEdit}>
          <ProfileEdit user={user} setIsEdit={setIsEdit} />
        </ModalComponent>
      ) : null}
    </div>
  );
};

export default Info;
