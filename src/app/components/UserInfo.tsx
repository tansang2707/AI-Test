"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@coin98-com/wallet-adapter-react";
import { formatAddress } from "../common/functions";
import { CopyCheckIcon, ExpandIcon } from "lucide-react";
import { useAppContext } from "../providers/AppProvider";

const List = ["tomo", "ether", "matic", "binanceSmart", "solana"];

const UserInfo = () => {
  const { activeAddress } = useAppContext();
  const { disconnect } = useWallet();

  const renderBlockChain = () => {
    return List.map((it) => {
      return <DropdownMenuItem key={it}>{it}</DropdownMenuItem>;
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex flex-col justify-start text-left">
          <span>1000 VIC</span>
          <span>{formatAddress(activeAddress?.address as string)}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex items-center">
            <span>{formatAddress(activeAddress?.address as string)}</span>

            <CopyCheckIcon className="ml-2" />

            <ExpandIcon className="ml-2" />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Block Chain</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {renderBlockChain()}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect}>Disconnect</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserInfo;
