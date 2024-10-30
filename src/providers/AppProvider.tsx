"use client";
import { useWallet } from "@coin98-com/wallet-adapter-react";
import React, {
  ReactNode,
  FunctionComponent,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { getChainById, getChainNameById } from "../common/functions";
import { CHAIN_DATA } from "@/common/constant";
import { useToast } from "@/hooks/use-toast";
import get from "lodash/get";

interface IProviderProps {
  children: ReactNode;
}

interface IContext {
  activeAddress?: WalletConfig;
  onSwitchNetwork?: (chainId: string) => Promise<void>;
}

type WalletConfig = {
  address: string | null;
  chainName: string | null;
  chainId: string | string[] | null;
  chain: string | null;
};

const initialState: IContext = {};

const Context = createContext<IContext>({ ...initialState });

const DEFAULT_DATA = {
  address: "",
  chainId: "",
  chainName: "",
  chain: "",
};

export const useAppContext = () => useContext<IContext>(Context);

const AppProvider: FunctionComponent<IProviderProps> = ({ children }) => {
  const {
    address,
    selectedChainId,
    selectedBlockChain,
    connected,
    switchBlockChain,
  } = useWallet();

  const { toast } = useToast();

  const [activeAddress, setActiveAddress] =
    useState<WalletConfig>(DEFAULT_DATA);

  const onSwitchNetwork = async (chainId: string) => {
    try {
      if (chainId === "solana") {
        await switchBlockChain("solana");
        const accounts = await window.coin98.sol.request({
          method: "sol_accounts",
        });
        const address = accounts[0];
        setActiveAddress({
          address,
          chainId,
          chainName: getChainNameById(chainId),
          chain: getChainById(chainId),
        });
      } else {
        let currentAddress = address;
        if (selectedBlockChain === "solana") {
          await switchBlockChain("evm");
          const response = await window.coin98.provider.request({
            method: "eth_requestAccounts",
          });

          currentAddress = get(response, "[0]", "");
        }
        const response = await window.coin98.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
        if (response) {
          setActiveAddress({
            address: currentAddress,
            chainId,
            chainName: getChainNameById(chainId),
            chain: getChainById(chainId),
          });
        }
      }
    } catch (error) {
      console.log("🚀 ~ onSwitchNetwork ~ error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        //@ts-ignore
        description: error?.message?.toString(),
      });
    }
  };

  const value: IContext = {
    activeAddress,
    onSwitchNetwork,
  };

  useEffect(() => {
    if (connected && address) {
      if (selectedChainId) {
        setActiveAddress({
          address,
          chainId: selectedChainId,
          chainName: getChainNameById(selectedChainId as string),
          chain: getChainById(selectedChainId as string),
        });
      } else if (selectedBlockChain === "solana") {
        setActiveAddress({
          address,
          chainId: "solana",
          chainName: "Solana",
          chain: "solana",
        });
      }
    }
  }, [connected, selectedChainId, address, selectedBlockChain]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default AppProvider;
