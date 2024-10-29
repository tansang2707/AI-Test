"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SelectChain from "./SelectChain";
import { TOKEN_ADDRESS } from "./constants";
import { useForm } from "react-hook-form";
import FormData from "./FormData";
import { Form } from "@/components/ui/form";
import { CHAIN_DATA } from "@/common/constant";
import get from "lodash/get";
import Web3 from "web3";
import { C98_ECR20 } from "@/common/abi/C98ERC20";
import { waitTxnUntilDone } from "@/common/functions";
import { useAppContext } from "@/providers/AppProvider";
import { useToast } from "@/hooks/use-toast";
import { createAtaAccount, genConnectionSolana } from "@/common/solana";
import { PublicKey, Transaction } from "@solana/web3.js";
import { Token } from "@solana/spl-token";
import bs58 from "bs58";

type SelectedToken = "c98" | "saros";

const burnMintTokenData = {
  amount: "",
};

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

const BurnMintToken = () => {
  const { toast } = useToast();
  const { activeAddress } = useAppContext();
  const [currentToken, setCurrentToken] = useState<SelectedToken>("c98");
  const [selectedChain, setSelectedChain] = useState("ether");
  const [isLoading, setIsLoading] = useState(false);
  const [hash, setHash] = useState("");

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

  const handleError = (type: string, message: string) => {
    toast({
      variant: "destructive",
      title: type.toUpperCase(),
      description: message,
    });
  };

  const handleToggleLoading = (value: boolean) => {
    setIsLoading(value);
  };

  const handleSubmit = async (amount: string, type: "burn" | "mint") => {
    handleToggleLoading(true);
    const chainActive = get(CHAIN_DATA, `${selectedChain}`);
    // Solana
    if (chainActive?.chain === "solana") {
      try {
        let solAddress = "";

        await window.coin98?.sol
          .request({ method: "sol_accounts" })
          //@ts-ignore
          .then((accounts) => {
            if (accounts[0]) {
              solAddress = accounts[0];
            } else {
              handleError(type, "Wallet not found");
            }
          });
        const requestUnlock = await window.coin98?.provider?.request({
          method: "request_unlock",
        });
        if (!get(requestUnlock, "isUnlocked", false)) {
          return { isErr: true, data: "unlockFail" };
        }

        const connection = genConnectionSolana();

        const transaction = new Transaction({
          feePayer: new PublicKey(solAddress),
        });

        const ataAccount = await createAtaAccount(
          connection,
          new PublicKey(solAddress),
          new PublicKey(TOKEN_ADDRESS[currentToken]["solana"])
        );

        const instructionMethod =
          type === "burn"
            ? Token.createBurnInstruction
            : Token.createMintToInstruction;

        const instruction = instructionMethod(
          new PublicKey(TOKEN_PROGRAM_ID),
          new PublicKey(TOKEN_ADDRESS[currentToken]["solana"]),
          ataAccount.account,
          new PublicKey(solAddress),
          [],
          //@ts-ignore
          Web3.utils.toWei(amount, "mwei")
        );

        transaction.add(instruction);

        let blockhash = (await connection.getLatestBlockhash("finalized"))
          .blockhash;

        transaction.recentBlockhash = blockhash;

        const response = await window.coin98.sol.request({
          method: "sol_sign",
          params: [transaction],
        });

        const publicKey = new PublicKey(response.publicKey);

        transaction.addSignature(
          publicKey,
          bs58.decode(response.signature) as Buffer
        );
        const rawTransaction = transaction.serialize();

        const tx: any = await connection
          .sendRawTransaction(rawTransaction, {
            skipPreflight: false,
            preflightCommitment: "confirmed",
          })
          .catch((err) => {
            const data = JSON.stringify(get(err, "logs", ""));
            console.log("🚀 ~ BurnMintToken ~ data:", data);
            return { isErr: true, data: data };
          });
        const { isErr } = tx;

        if (isErr) {
          throw "Transaction failed";
        }

        connection.onSignatureWithOptions(
          tx,
          async (e: any) => {
            if (!e?.result?.err) {
              // handleSucess(type, `${chainActive.scan}/tx/${tx}`);
              setHash(tx);
            }
            handleToggleLoading(false);
          },
          {
            commitment: "confirmed",
          }
        );
      } catch (error) {
        console.log("🚀 ~ handleSubmit ~ error:", error);
        //@ts-ignore
        handleError(type, error?.message);
        handleToggleLoading(false);
      }
    } else {
      // Evm
      try {
        const rpc = chainActive.rpcURL;
        const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

        const tokenAddress = get(
          TOKEN_ADDRESS,
          `${currentToken}.${selectedChain}`
        );

        const contract = new web3.eth.Contract(C98_ECR20 as any, tokenAddress);

        const func: any = contract.methods[type];

        let dataTxs = "";

        if (type == "burn") {
          dataTxs = func(Web3.utils.toWei(amount, "ether")).encodeABI();
        } else if (type === "mint") {
          dataTxs = func(
            activeAddress?.address,
            Web3.utils.toWei(amount, "ether")
          ).encodeABI();
        }

        const generateTxs = {
          from: activeAddress?.address,
          to: tokenAddress,
          data: dataTxs,
          percent: 2,
          nonce: "",
        };

        if (chainActive.chain !== "binanceSmart") {
          const nonce = await web3.eth.getTransactionCount(
            activeAddress?.address as string
          );
          generateTxs.nonce = Web3.utils.toHex(nonce);
        } else {
          //@ts-ignore
          delete generateTxs.nonce;
        }

        const hash = await window.coin98.provider.request({
          method: "eth_sendTransaction",
          params: [generateTxs],
        });

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
          handleError(type, "common_system_error");
        } else {
          setHash(hash);
        }
        // return handleSucess(type, `${chainActive.scan}/tx/${hash}`);
      } catch (e) {
        console.log("🚀 ~ handleSubmit ~ e:", e);
        //@ts-ignore
        handleError(type, e?.message as string);
      } finally {
        handleToggleLoading(false);
      }
    }
  };

  const handleClearHash = () => {
    setHash("");
  };

  return (
    <div className="rounded-xl flex grow h-full p-8 flex-col">
      <div className="flex gap-4 items-center">
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
      <div className="mt-4">
        <Form {...methods}>
          <FormData
            currentToken={currentToken}
            selectedChain={selectedChain}
            isLoading={isLoading}
            hash={hash}
            onClearHash={handleClearHash}
            onToogleLoading={handleToggleLoading}
            onSubmit={handleSubmit}
          />
        </Form>
      </div>
    </div>
  );
};

export default BurnMintToken;
