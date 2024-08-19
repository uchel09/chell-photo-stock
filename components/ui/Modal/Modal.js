"use client";
import "./Modal.css";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const ModalComponent = ({ children, open }) => {
  const router = useRouter();

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style = "";
    };
  }, []);

  function handleClose() {
    if (open) {
      return open(false);
    }

    router.push(url || "/");
  }
  return (
    <div className="modal">
      <div className="modal_close" onClick={handleClose} />

      <div className="modal_container">
        <button className="modal_btn_close" onClick={handleClose}>
          <i className="material-symbols-outlined">close</i>
        </button>

        <div className="modalc-content">{children}</div>
      </div>
    </div>
  );
};

export default ModalComponent;
