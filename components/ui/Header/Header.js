import React from "react";
import "./Header.css";
import Image from "next/image";
import BgBanner from "@/public/bg_01.jpg";
import SearchForm from "@/components/forms/SearchForm/SearchForm";

const Header = () => {
  return (
    <header>
      <Image
        src={BgBanner}
        alt="header background"
        fill
        placeholder="blur"
        priority
        sizes="(max-width: 50px) 2vw"
      />

      <div className="header_container">
        <div className="header_content">
          <h1>
            The Best <span className="text-gradient-1">free stock photos</span>, royalti{" "}
            <span className="text-gradient-2">free images</span> shared by creators.{" "}
          </h1>
          <div className="header_search">
            <SearchForm />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
