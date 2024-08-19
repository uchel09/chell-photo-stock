import "./Nav.css";
import React from "react";
import Navbar from "./Navbar";
import getServerUser from "@/utils/getServer";

const Nav = async () => {
  const user = await getServerUser();
  return <Navbar user={user} />;
};

export default Nav;
