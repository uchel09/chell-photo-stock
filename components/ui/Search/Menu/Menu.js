import { getPhotos, getPhotosCount } from "@/actions/photoAction";
import "./Menu.css";

import React from "react";
import { getUsersCount } from "@/actions/userAction";
import Link from "next/link";
import formatNumber from "@/utils/formatNumber";

const SearchMenu = async ({ page, search, id }) => {

  const pages =["photos","users","private"] 
  if(!pages.includes(page)) return null


  const [photos_count, users_count, pri_count] = await Promise.all([
    getPhotosCount({ page: "photos", search }),
    getUsersCount({ page: "users", search }),
    id ? getPhotosCount({ page: "private", search, id }) : 0,
  ]);

  return (
    <div className="menu_container">
      <ul className="container">
        <li className={page === "photos" ? "active" : ""}>
          <Link href={`/search/photos/${search}`}>
            <i className="material-symbols-outlined">filter</i>
            <div>Photos {formatNumber(photos_count)}</div>
          </Link>
        </li>
        <li className={page === "users" ? "active" : ""}>
          <Link href={`/search/users/${search}`}>
            <i className="material-symbols-outlined">people</i>
            <div>Users {formatNumber(users_count)}</div>
          </Link>
        </li>
        {id ? (
          <li className={page === "private" ? "active" : ""}>
            <Link href={`/search/private/${search}`}>
              <i className="material-symbols-outlined">lock</i>
              <div>
                Pri<span>Photos</span> {formatNumber(pri_count)}
              </div>
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default SearchMenu;
