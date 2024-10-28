'use client'
import React, { FunctionComponent, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TOKEN_ADDRESS } from "./constants";
import { CHAIN_DATA } from "@/app/common/constant";

import get from "lodash/get";

interface ISelectChain {
  selectedValue: string;
  token: "c98" | "saros";
  onValueChange: (value: string) => void;
}

type Item = {
  title: string;
  value: string;
  symbol: string;
  image: string;
};

const SelectChain: FunctionComponent<ISelectChain> = ({
  selectedValue,
  token,
  onValueChange,
}) => {
  const listChain = useMemo(() => {
    return Object.keys(TOKEN_ADDRESS[token]);
  }, [token]);

  const mapChainOption = (chain: string) => {
    return {
      title: get(CHAIN_DATA, `${chain}.name`) || '',
      value: chain,
      symbol: get(CHAIN_DATA, `${chain}.symbol`) || '',
      image: get(CHAIN_DATA, `${chain}.image`) || '',
    };
  };

  const mapChainOptions = (Object.keys(CHAIN_DATA) || []).reduce(
    (res: Item[], chain: string) => {
      if (listChain.includes(chain)) {
        return [...res, mapChainOption(chain)];
      } else {
        return res;
      }
    },
    []
  );

  const renderItem = () => {
    return listChain.map((it: string) => (
      <SelectItem value={it} key={it}>
        {it}
      </SelectItem>
    ));
  };

  return (
    <Select
      value={selectedValue}
      onValueChange={onValueChange}
      defaultValue={selectedValue}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Chain" />
      </SelectTrigger>
      <SelectContent>{renderItem()}</SelectContent>
    </Select>
  );
};

export default SelectChain;
