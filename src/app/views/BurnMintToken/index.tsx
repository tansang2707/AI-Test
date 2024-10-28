"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SelectChain from "./SelectChain";
import { TOKEN_ADDRESS } from "./constants";
import { useForm } from "react-hook-form";
import FormData from "./FormData";
import { Form } from "@/components/ui/form";
import { CHAIN_DATA } from "@/app/common/constant";
import get from "lodash/get";
import { useWallet } from "@coin98-com/wallet-adapter-react";
import Web3 from "web3";
import { C98_ECR20 } from "@/app/common/abi/C98ERC20";
import { waitTxnUntilDone } from "@/app/common/functions";

type SelectedToken = "c98" | "saros";

const burnMintTokenData = {
  amount: "",
};

const BurnMintToken = () => {
  const { address, selectedChainId } = useWallet();
  const [currentToken, setCurrentToken] = useState<SelectedToken>("c98");
  const [selectedChain, setSelectedChain] = useState("ether");

  const methods = useForm<{
    burnMintToken: {
      amount: string | number;
    };
  }>({
    defaultValues: {
      burnMintToken: burnMintTokenData,
    },
  });

  const handleChangeToken = (token: SelectedToken) => {
    setCurrentToken(token);
    const currentChain = Object.keys(TOKEN_ADDRESS[token])[0];
    setSelectedChain(currentChain);
  };

  const handleSelectChain = (chain: string) => {
    setSelectedChain(chain);
  };

  const handleSubmit = async (amount: string, type: "burn" | "mint") => {
    const chainActive = get(CHAIN_DATA, `${selectedChain}`);
    // Evm
    try {
      const rpc = chainActive.rpcURL;
      const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

      const tokenAddress = get(
        TOKEN_ADDRESS,
        `${currentToken}.${selectedChain}`
      );

      const contract = new web3.eth.Contract(C98_ECR20 as any, tokenAddress);

      const func: any = contract.methods["mint"];

      let dataTxs = "";

      if (type == "burn") {
        dataTxs = func(Web3.utils.toWei(amount, "ether")).encodeABI();
      } else if (type === "mint") {
        dataTxs = func(address, Web3.utils.toWei(amount, "ether")).encodeABI();
      }

      const generateTxs = {
        from: address,
        to: tokenAddress,
        data: dataTxs,
        percent: 2,
        nonce: '',
        gasPrice: null,
      };

      if (chainActive.chain !== "binanceSmart") {
        const nonce = await web3.eth.getTransactionCount(address as string);
        generateTxs.nonce = Web3.utils.toHex(nonce);
      } else {
        delete generateTxs.nonce;
      }
      console.log("🚀 ~ handleSubmit ~ generateTxs:", generateTxs)

      const hash = await  window.coin98.provider.request({
        method: "eth_sendTransaction",
        params: [generateTxs],
      });
      console.log("🚀 ~ handleSubmit ~ hash:", hash)

      const txnReceipt = await waitTxnUntilDone(
        () =>
          window.coin98.provider.request({
            method: "eth_getTransactionReceipt",
            params: [hash],
          }),
        1000,
        3000
      );
      const status = Number(get(txnReceipt, "status", "0"));
      if (!status) {
        // handleError(type, "common_system_error");
      }

      // setIsLoading(false);
      // return handleSucess(type, `${chainActive.scan}/tx/${hash}`);
    } catch (e) {
      // handleError(type, e);
    }
  };

  return (
    <div className="rounded-xl flex grow h-full p-8 flex-col">
      <div className="flex gap-4 mb-6 items-center">
        {/* Select token */}
        <RadioGroup
          value={currentToken}
          className="flex space-x-2"
          onValueChange={handleChangeToken}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="c98" id="c98" />
            <Label htmlFor="c98">C98</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="saros" id="saros" />
            <Label htmlFor="saros">Saros</Label>
          </div>
        </RadioGroup>

        {/* Select chain */}
        <SelectChain
          selectedValue={selectedChain}
          token={currentToken}
          onValueChange={handleSelectChain}
        />
      </div>

      {/* FormData */}
      <Form {...methods}>
        <FormData selectedChain={selectedChain} onSubmit={handleSubmit} />
      </Form>
    </div>
  );
};

export default BurnMintToken;
