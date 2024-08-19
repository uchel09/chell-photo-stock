"use client";
import React from "react";
import "./SearchForm.css";
import { useRouter } from "next/navigation";

const SearchForm = () => {
  const router = useRouter();

  const handleAction = (formData) => {
    const value = formData.get("search");

    const search = value?.toLowerCase().trim().replaceAll(/\s+/g, " ");
    router.push(`/search/photos/${search}`);
  };
  return (
    <form className="search_form" action={handleAction}>
      <button className="s_f_btn_search" title="search">
        <span className="material-symbols-outlined">search</span>
      </button>
      <input
        className="s_f_input"
        type="search"
        name="search"
        placeholder="Search..."
        autoComplete="off"
        required
      />
    </form>
  );
};

export default SearchForm;
