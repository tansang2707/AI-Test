import React, { FunctionComponent } from "react";
import Layout from "@/components/Layout";

interface ILayout {
  children: React.ReactNode;
}

const layout: FunctionComponent<ILayout> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default layout;
