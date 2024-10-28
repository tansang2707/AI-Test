"use client";
import { Button } from "@/components/ui/button";
import { useWallet } from "@coin98-com/wallet-adapter-react";
import { useWalletModal } from "@coin98-com/wallet-adapter-react-ui";
import React, { FunctionComponent, useEffect } from "react";

interface IButtonConnectWallet {
  children: React.ReactNode;
}

const ButtonConnectWallet: FunctionComponent<IButtonConnectWallet> = ({
  children,
}) => {
  const { openWalletModal } = useWalletModal();
  const { connected, selectedChainId, switchNetwork, disconnect, provider } =
    useWallet();
    console.log("🚀 ~ selectedChainId:", selectedChainId)

    const onSwitch = (value) => {
    console.log("🚀 ~ onSwitch ~ value:", value)

    }


  //   const onSwitch = async (error: Error & { code?: number }) => {
  //     try {
  //       if (error.code === 4902) {
  //         const chainData = CHAIN_DATA["tomo"];

  //         await (provider as any).request({
  //           method: "wallet_addEthereumChain",
  //           params: [
  //             {
  //               chainId: chainData.chainId,
  //               chainName: chainData.chainName,
  //               rpcUrls: [chainData.rpcURL],
  //               nativeCurrency: {
  //                 symbol: chainData.symbol,
  //               },
  //             },
  //           ],
  //         });
  //       }
  //     } catch (error) {
  //       disconnect();
  //     }
  //   };

  //   useEffect(() => {
  //     if (
  //       activeChain ===
  //         CHAIN_SUPPORTED[!IS_DEVNET ? 'VICTION' : 'VICTION_DEVNET'] &&
  //       selectedChainId &&
  //       selectedChainId !==
  //         CHAIN_DATA[CHAIN_SUPPORTED[!IS_DEVNET ? 'VICTION' : 'VICTION_DEVNET']]
  //           .chainId
  //     ) {
  //       switchNetwork(
  //         CHAIN_DATA[CHAIN_SUPPORTED[!IS_DEVNET ? 'VICTION' : 'VICTION_DEVNET']]
  //           .chainId,
  //         onSwitch,
  //       );
  //     }
  //   }, [selectedChainId]);

  //    // Set cookie state if not have
  //    useEffect(() => {
  //     const isConnectedCookie = getCookie(COOKIE_KEY.IS_WALLET_CONNECTED);

  //     if (!isConnectedCookie && connected) {
  //       setCookie(COOKIE_KEY.IS_WALLET_CONNECTED, true);
  //     }
  //   }, [connected]);


  if (!connected) {
    return <Button onClick={openWalletModal}>Connect Wallet</Button>;
  }
  return children;
};

export default ButtonConnectWallet;
