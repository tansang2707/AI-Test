// modal.tsx
"use client";

import dynamic from "next/dynamic";
import { viction } from "@coin98-com/wallet-adapter-react-ui";

const WalletModalC98 = dynamic(
  async () =>
    (await import("@coin98-com/wallet-adapter-react-ui")).WalletModalC98,
  {
    ssr: false,
  }
);

const Coin98AdapterModal = () => {
  //   const defaultChains = [...evmChains]; // multi-chain
  const defaultChains = [viction]; // single-chains
  return (
    <WalletModalC98
      isC98Theme
      isHiddenSocial
      enableChains={defaultChains}
      overlayClass="backdrop-filter-none bg-background-overlay duration-500"
      // layoutClass="text-text-primary bg-background-surface [&_.svg-icon]:filter-none [&_.c98-bg-bkg-secondary]:bg-background-white [&_.c98-bg-bkg-primary]:bg-background-input [&_.svg-active]:bg-[#D4DACE] [&_.svg-active>p]:text-brand-primary"
      // overlayClass="backdrop-filter-none bg-background-overlay duration-500"
    />
  );
};

export default Coin98AdapterModal;
