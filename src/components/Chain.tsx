import React, { FunctionComponent } from "react";
import { Icon } from "./Icon";
import get from "lodash/get";
import { CHAIN_DATA } from "@/common/constant";

interface IChain {
  chainId: string;
}

const Chain: FunctionComponent<IChain> = ({ chainId }) => {
  const currentChain = get(CHAIN_DATA, chainId);

  return (
    <div className="flex items-center">
      <Icon iconName={currentChain?.image} />
      <span className="ml-1">{currentChain?.name}</span>
    </div>
  );
};

export default Chain;
