import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import ButtonConnectWallet from "./ButtonConnectWallet";
import UserInfo from "./UserInfo";

const Header = () => {
  return (
    <div className="flex justify-between p-2 px-8 gap-2 bg-sidebar">
      <SidebarTrigger />
      <ButtonConnectWallet>
        <UserInfo />
      </ButtonConnectWallet>
    </div>
  );
};

export default Header;
