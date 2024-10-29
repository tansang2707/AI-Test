import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import get from "lodash/get";
import { CHAIN_DATA } from "./constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAddress = (address: string, length = 6) => {
  if (!address) return "";

  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

const txsFail = "txsFail";

export function encodeMessErr(mess: unknown) {
  const stringResult = mess ? mess.toString() : "";
  if (stringResult.includes("Error")) {
    let mess = txsFail;
    switch (true) {
      case stringResult.includes("0x1") ||
        stringResult.includes("Insufficient funds"):
        mess = "tradeErrFund";
        break;
      case stringResult.includes("size too small"):
        mess = "sizeTooSmall";
        break;
      case stringResult.includes("Transaction too large"):
        mess = "tooLarge";
        break;
      case stringResult.includes("0x1") ||
        stringResult.includes("Attempt to debit an account but") ||
        stringResult.includes("prior credit"):
        mess = "gasSolNotEnough";
        break;
      case stringResult.includes("the capitalization checksum"):
        mess = "";
        break;
    }
    return mess;
  } else {
    return txsFail;
  }
}

export const waitTxnUntilDone = (
  fn: () => Promise<any>,
  time = 1000,
  limit = 60
) => {
  const now = Date.now() / 1000; // in seconds

  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const isExpired = Date.now() / 1000 - now >= limit;

        if (isExpired) {
          timer && clearInterval(timer);
          reject("Timeout");
        }
        const response = await fn();

        if (response) {
          clearInterval(timer);
          resolve(response);
        }
      } catch (error) {
        clearInterval(timer);
        reject(get(error, "message"));
      }
    }, time);
  });
};

export const sleep = (ms = 500): Promise<void> => {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const getChainNameById = (chainId: string) => {
  const chain = Object.keys(CHAIN_DATA).find(
    (it) => get(CHAIN_DATA, `${it}.chainId`, "") === chainId
  );
  return chain ? get(CHAIN_DATA, `${chain}.name`, "") : "";
};

export const getChainById = (chainId: string) => {
  const chain = Object.keys(CHAIN_DATA).find(
    (it) => get(CHAIN_DATA, `${it}.chainId`, "") === chainId
  );
  return chain || ''
};

export const getChainSymbol = (chain: string) =>
  get(get(CHAIN_DATA, chain), 'symbol', '');

export const upperCaseFirstLetter = (lower) => {
  if (!lower) return lower;
  const upper = lower.replace(/^\w/, (chr) => chr.toUpperCase());
  return upper;
};
