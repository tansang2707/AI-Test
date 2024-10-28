import { Token } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";
import bs58 from "bs58";
import { C98_ECR20 } from "@/app/common/abi/C98ERC20";
import { CHAIN_DATA } from "@/app/common/constant";
import { encodeMessErr } from "@/app/common/functions";
import { createAtaAccount, genConnectionSolana } from "common/solana";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import { CHAIN_TYPE, waitTxnUntilDone } from "utils";
import Web3 from "web3";
import { TOKEN_ADDRESS } from "./constants";
import { MINTABI } from "./abi";

type IHandleSubmitData = {
  data?: any;
  type?: string;
  selectedChain: {
    title?: string;
    value?: string;
    symbol?: string;
    image?: string;
  };
  activeWallet: {
    chain?: string;
    address?: string;
  };
  handleSucess?: (type, utl) => void;
  currentToken?: string;
  handleError?: (type, value) => void;
  setIsLoading?: (loading) => void;
};

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export const handleSubmitForm = async ({
  data,
  type = "mint",
  selectedChain = {
    title: get(CHAIN_DATA, `ether.name`),
    value: "ether",
    symbol: get(CHAIN_DATA, `ether.symbol`),
    image: get(CHAIN_DATA, `ether.image`),
  },
  activeWallet,
  handleSucess = () => {},
  currentToken = "c98",
  handleError = () => {},
  setIsLoading = () => {},
}: IHandleSubmitData) => {
  const amount = data?.burnMintToken?.amount;
  const chain = cloneDeep(selectedChain);

  const chainActive = CHAIN_DATA[chain?.value];

  if (chain.value === CHAIN_TYPE.solana) {
    // Solana
    try {
      let solAddress = "";

      await window.coin98?.sol
        .request({ method: "sol_accounts" })
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
        new PublicKey(TOKEN_ADDRESS[currentToken][CHAIN_TYPE[chain.value]])
      );

      const instructionMethod =
        type === "burn"
          ? Token.createBurnInstruction
          : Token.createMintToInstruction;

      const instruction = instructionMethod(
        new PublicKey(TOKEN_PROGRAM_ID),
        new PublicKey(TOKEN_ADDRESS[currentToken][CHAIN_TYPE[chain.value]]),
        ataAccount.account,
        new PublicKey(solAddress),
        [],
        Web3.utils.toWei(amount, "mwei")
      );

      transaction.add(instruction);

      const blockhash = (await connection.getLatestBlockhash("finalized"))
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
          return { isErr: true, data: encodeMessErr(data) };
        });
      const { isErr } = tx;

      if (isErr) {
        throw "Transaction failed";
      }

      connection.onSignatureWithOptions(
        tx,
        async (e: any) => {
          setIsLoading(false);
          if (!e?.result?.err) {
            handleSucess(type, `${chainActive.scan}/tx/${tx}`);
          }
        },
        {
          commitment: "confirmed",
        }
      );
    } catch (error) {
      return handleError(type, error);
    }
  } else {
    // Evm
    try {
      const rpc = chainActive.rpcURL;
      const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

      const tokenAddress = TOKEN_ADDRESS[currentToken][chain.value];

      const contract = new web3.eth.Contract(C98_ECR20 as any, tokenAddress);

      const func: any = contract.methods[type];

      let dataTxs = "";

      if (type == "burn") {
        dataTxs = func(Web3.utils.toWei(amount, "ether")).encodeABI();
      } else if (type === "mint") {
        dataTxs = func(
          activeWallet?.address,
          Web3.utils.toWei(amount, "ether")
        ).encodeABI();
      }

      const generateTxs = {
        from: activeWallet?.address,
        to: TOKEN_ADDRESS[currentToken][chain.value],
        data: dataTxs,
        percent: 2,
        nonce: null,
        gasPrice: null,
      };

      if (chainActive.chain !== "binanceSmart") {
        const nonce = await web3.eth.getTransactionCount(activeWallet.address);
        generateTxs.nonce = Web3.utils.toHex(nonce);
      } else {
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
      }

      setIsLoading(false);
      return handleSucess(type, `${chainActive.scan}/tx/${hash}`);
    } catch (e) {
      handleError(type, e);
    }
  }
};
