"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Configs",
      url: "/",
      items: [
        {
          title: "Burn Mint Token",
          url: "/burn-mint-token",
        },
        {
          title: "Banner",
          url: "/banner",
        },
        {
          title: "Multisig Coin98",
          url: "/multisig-coin98",
        },
        {
          title: "Multisig Viction",
          url: "/multisig-viction",
        },
        {
          title: "Push Message",
          url: "/push-message",
        },
        {
          title: "Events",
          url: "/events",
        },
        {
          title: "Tearms And Policy",
          url: "/terms-and-policy",
        },
        {
          title: "Others",
          url: "/others",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  console.log("🚀 ~ AppSidebar ~ pathname:", pathname);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Image src={"/logoAdmin.svg"} width={160} height={40} alt="logo" />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => {
          return (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
