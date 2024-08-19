"use client";

import React from "react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import SearchForm from "@/components/forms/SearchForm/SearchForm";

const Navbar = ({ user }) => {
  return (
    <nav>
      <div className="container navbar">
        <Link href="/" className="nav_logo">
          <b>C</b>
          <p>hell</p>
        </Link>
        <div className="nav_search">
          <SearchForm />
        </div>
        <div className="nav_menu">
          {!user ? (
            <>
              <button
                className="btn btn_login"
                onClick={() => signIn("google")}
              >
                <span className="material-symbols-outlined">person</span>
                <p>Log in</p>
              </button>
              <button
                className="btn btn_icon"
                onClick={() => signIn("google", { callbackUrl: "/upload" })}
              >
                <span className="material-symbols-outlined">upload</span>
                <p>Submit a Photo</p>
              </button>
            </>
          ) : (
            <>
              <Link href="/upload" className="btn btn_icon">
                <span className="material-symbols-outlined">upload</span>
                <p>Submit a Photo</p>
              </Link>
              <Link href={`/profile/${user?._id}`} className="avatar">
                <Image
                  src={user?.avatar}
                  alt={user?.name}
                  width={40}
                  height={40}
                  sizes="25vw"
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
