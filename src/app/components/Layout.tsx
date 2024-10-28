import React, { Fragment, FunctionComponent } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "./Header";

interface ILayout {
  children: React.ReactNode;
}

const Layout: FunctionComponent<ILayout> = ({ children }) => {
  return (
    <Fragment>
      <SidebarProvider>
        <AppSidebar />
        <main className="grow">
          <Header />
          {children}
        </main>
      </SidebarProvider>
    </Fragment>
  );
};

export default Layout;
