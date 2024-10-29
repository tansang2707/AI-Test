"use client";
import React, { FunctionComponent, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TOKEN_ADDRESS } from "./constants";
import { CHAIN_DATA } from "@/common/constant";

import get from "lodash/get";
import { Icon } from "@/components/Icon";

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

  const renderItem = () => {
    return listChain.map((it: string) => {
      const currentChain = get(CHAIN_DATA, it);
      return (
        <SelectItem value={it} key={it}>
          <div className="flex items-center">
            <Icon iconName={currentChain?.image} />
            <span className="ml-1">{currentChain?.name}</span>
          </div>
        </SelectItem>
      );
    });
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
