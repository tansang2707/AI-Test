import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    Token,
  } from "@solana/spl-token";
  import { Connection, PublicKey } from "@solana/web3.js";
  import { convertWeiToBalance } from "./utils/convertPrice";
  
  export const genConnectionSolana = () => {
    const connectionSolana = new Connection(
      "https://information.coin98.com/api/solanaV4",
      {
        commitment: "recent",
        httpHeaders: {
          development: "coin98",
          authority: "coin98.com",
          Version: "1.0",
          Authorization: "Bearer token",
          Signature:
            "c26340d5243d802f03de751b9cbc049557ad0a14296aacf4a37dc7399adbe65c",
          origin: "https://wallet.coin98.com",
          referer: "https://wallet.coin98.com",
        },
      }
    );
    return connectionSolana;
  };
  
  //@ts-ignore
  export const createAtaAccount = async (connection, owner, mintAddress) => {
    const mint = new PublicKey(mintAddress);
    const ata = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      owner,
      true
    );
  
    const rootSignerProgram = await connection.getAccountInfo(ata);
  
    if (!rootSignerProgram) {
      const createATAInstruction =
        await Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mint,
          ata,
          owner,
          owner
        );
      return { type: "create", account: ata, ins: createATAInstruction };
    }
    return { account: ata };
  };
  
  type SolanaGetBalance = {
    address?: string;
    contract?: unknown;
    connection?: unknown;
    isGetRawAmount?: boolean;
  };
  
  export const solanaGetBalance = async (data: SolanaGetBalance) => {
    const { address, contract, connection, isGetRawAmount } = data;
    if (!address) return 0;
    try {
      const connectionSolana = connection || genConnectionSolana();
  
      const pubKey = new PublicKey(address);
  
      if (contract) {
        //@ts-ignore
        const tokenInfo = await connectionSolana.getTokenAccountBalance(
          pubKey,
          "recent"
        );
        return isGetRawAmount
          ? tokenInfo?.value?.amount
          : tokenInfo?.value?.uiAmount;
      }
      //@ts-ignore
      const balance = await connectionSolana.getBalance(pubKey);
      return isGetRawAmount ? balance : convertWeiToBalance(balance, 9);
    } catch (error) {
      return 0;
    }
  };
  