"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@coin98-com/wallet-adapter-react";
import { formatAddress, getChainSymbol } from "@/common/functions";
import { CopyCheckIcon, ExpandIcon } from "lucide-react";
import { useAppContext } from "@/providers/AppProvider";
import { CHAIN_DATA } from "@/common/constant";
import { get } from "lodash";
import Web3 from "web3";
import {
  convertWeiToBalance,
  formatReadableNumber,
} from "@/common/utils/convertPrice";
import { Icon } from "./Icon";
import { genConnectionSolana } from "@/common/solana";
import { PublicKey } from "@solana/web3.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";

const List = ["tomo", "ether", "matic", "binanceSmart", "solana"];

const UserInfo = () => {
  const { activeAddress, onSwitchNetwork } = useAppContext();
  const { disconnect } = useWallet();
  const [balance, setBalance] = useState("0");
  const [isCopied, setIsCopied] = useState(false);

  const currentChain = useMemo(() => {
    if (!activeAddress?.chain) {
      return null;
    }
    return get(CHAIN_DATA, activeAddress?.chain);
  }, [activeAddress?.chain]);

  const decimal = useMemo(() => {
    if (!activeAddress) return 18;
    const chain = get(activeAddress, "chain");
    if (chain === "solana") return 9;
    return (
      get(CHAIN_DATA, `${chain}.decimals`) ||
      get(CHAIN_DATA, `${chain}.decimal`)
    );
  }, [activeAddress]);

  const init = async () => {
    if (currentChain) {
      if (currentChain?.chain === "solana") {
        const connection = genConnectionSolana();
        const nativeBalance = await connection.getBalanceAndContext(
          new PublicKey(activeAddress?.address as string),
          { commitment: "confirmed" }
        );

        setBalance(nativeBalance.value.toString());
      } else {
        const rpc = currentChain.rpcURL;
        const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
        const balance = await web3.eth.getBalance(
          activeAddress?.address as string,
          "latest"
        );
        setBalance(balance.toString());
      }
    }
  };

  const handleSelectChain = (chainId: string) => () => {
    onSwitchNetwork && onSwitchNetwork(chainId);
  };

  const handleCopy = () => {
    setIsCopied(true);
    window.navigator.clipboard.writeText(activeAddress?.address as string);
    setTimeout(() => {
      setIsCopied(false);
    }, 500);
  };

  const handleExplore = () => {
    if (currentChain && activeAddress?.address) {
      window.open(
        `${currentChain.scan}/address/${activeAddress?.address}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    if (activeAddress?.address && currentChain) {
      init();
    }
  }, [activeAddress?.address, currentChain]);

  const renderBlockChain = () => {
    return List.map((it) => {
      const currentChain = get(CHAIN_DATA, it);
      return (
        <DropdownMenuItem
          key={it}
          onClick={handleSelectChain(currentChain?.chainId || it)}
        >
          <Icon iconName={currentChain?.image} />
          <span>{currentChain?.name}</span>
        </DropdownMenuItem>
      );
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex flex-col justify-start text-left">
          <div className="flex items-center">
            <span>
              {formatReadableNumber(
                convertWeiToBalance(balance as string, decimal).toString(),
                {
                  isTokenAmount: true,
                }
              )}
            </span>
            <span className="uppercase ml-1">
              {getChainSymbol(get(activeAddress, "chain", "ether") as string)}
            </span>
          </div>
          <span>{formatAddress(activeAddress?.address as string)}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex items-center">
            <span>{formatAddress(activeAddress?.address as string)}</span>

            <TooltipProvider>
              <Tooltip open={isCopied}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1"
                    onClick={handleCopy}
                  >
                    <Icon iconName="copy-v2" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copied</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleExplore}>
                    <Icon iconName="explorer-v3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Explore</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
