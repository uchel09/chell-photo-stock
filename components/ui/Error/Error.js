"use client";

import toast from "react-hot-toast";


import React, { useEffect } from "react";

const ErrorComponent = ({ errMsg }) => {
  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg]);

  return (
    <h1
      style={{
        textAlign: "center",
        margin: "30px 0",
        textTransform: "uppercase",
        color: "red",
      }}
    >
      {errMsg}
    </h1>
  );
};

export default ErrorComponent;
