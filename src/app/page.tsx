"use client";
import React from "react";
import dynamic from "next/dynamic";

const BurnMintToken = dynamic(() => import("./views/BurnMintToken"), {
  ssr: false,
});

const Home = () => {
  return <BurnMintToken />;
};

export default Home;
