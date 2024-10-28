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
import { getChainNameById } from "../common/functions";

interface IProviderProps {
  children: ReactNode;
}

interface IContext {
  activeAddress?: WalletConfig;
  onSwitchNetwork: (chainId: string) => void;
}

type WalletConfig = {
  address: string | null;
  chainName: string | null;
  chainId: string | string[] | null;
};

const initialState: IContext = {
  onSwitchNetwork: () => null,
};

const Context = createContext<IContext>({ ...initialState });

const DEFAULT_DATA = {
  address: "",
  chainId: "",
  chainName: "",
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

  const [activeAddress, setActiveAddress] =
    useState<WalletConfig>(DEFAULT_DATA);

  const onSwitchNetwork = async (chainId: string) => {
    try {
      if (chainId === "solana") {
        await switchBlockChain("solana");
      } else {
        if (selectedBlockChain === "solana") {
          await switchBlockChain("evm");
        }
        const response = await window.coin98.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
        if (response) {
          setActiveAddress({
            address,
            chainId,
            chainName: "",
          });
        }
      }
    } catch (error) {
      console.log("🚀 ~ onSwitchNetwork ~ error:", error);
    }
  };

  const value: IContext = {
    activeAddress,
    onSwitchNetwork,
  };

  useEffect(() => {
    if (connected && selectedChainId && address) {
      setActiveAddress({
        address,
        chainId: selectedChainId,
        chainName: getChainNameById(selectedChainId as string),
      });
    }
  }, [connected, selectedChainId, address]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default AppProvider;
