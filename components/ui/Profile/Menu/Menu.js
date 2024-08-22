import Link from "next/link";
import "./Menu.css";

import React from "react";
import formatNumber from "@/utils/formatNumber";
import { getPhotosCount } from "@/actions/photoAction";

const ProfileMenu = async ({ id, page, myUserId }) => {

  if(id !== myUserId) return null 

  const pages = ["public", "private", "favorite"];
  if (!pages.includes(page)) return null;


  const [pub_count, pri_count,fav_count] =await Promise.all([
    getPhotosCount({id,page:"public"}),
    getPhotosCount({id,page:"private"}),
    getPhotosCount({id,page:"favorite"}),
  ])



  return (
    <div className="menu_container">
      <ul className="container">
        <li className={page === "public" ? "active" : ""}>
          <Link href={`/profile/${id}`}>
            <i className="material-symbols-outlined">filter</i>
            <div>
              Pub<b>lic</b> <span>Photos</span> {formatNumber(pub_count)}
            </div>
          </Link>
        </li>
        <li className={page === "private" ? "active" : ""}>
          <Link href={`/profile/${id}/private`}>
            <i className="material-symbols-outlined">lock</i>
            <div>
              Pri<b>vate</b> <span>Photos</span> {formatNumber(pri_count)}
            </div>
          </Link>
        </li>
        <li className={page === "favorite" ? "active" : ""}>
          <Link href={`/profile/${id}/favorite`}>
            <i className="material-symbols-outlined">bookmark_heart</i>
            <div>
              Fav<b>orite</b> <span>Photos</span> {formatNumber(fav_count)}
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ProfileMenu;
