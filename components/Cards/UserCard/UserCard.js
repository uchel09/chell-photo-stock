"use client";

import Image from "next/image";
import "./UserCard.css";
import { signOut } from "next-auth/react";
import React, { useState } from "react";
import Link from "next/link";
import { followUser } from "@/actions/userAction";

const UserCard = React.memo(({ user }) => {
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing);

  const handleFollow = async () => {
    if (!user?.myUserId) {
      return signIn("google");
    }
    setIsFollowing((prev) => !prev);

    await followUser({ ...user, isFollowing });
  };
  return (
    <div className="user_card">
      <div className="avatar">
        <Image
          src={user?.avatar}
          alt={user?.name}
          width={100}
          height={100}
          sizes="25vw"
        />
      </div>

      <div className="u_c_info">
        <h3 className="text-ellipsis"> {user?.name} </h3>
        <small className="text-ellipsis">{user?.email}</small>
      </div>

      {user?._id === user?.myUserId ? (
        <button className="btn btn_logout" onClick={signOut}>
          <i className="material-symbols-outlined">logout</i>
          <span>Logout</span>
        </button>
      ) : (
        <button
          className={`btn ${isFollowing ? "following" : ""}`}
          onClick={handleFollow}
        >
          <i className="material-symbols-outlined">
            {isFollowing ? "check_circle" : "add_circle"}
          </i>
          <span>{isFollowing ? "Following" : "Follow"}</span>
        </button>
      )}

      <Link href={`/profile/${user?._id}`} />
    </div>
  );
});

export default UserCard;
