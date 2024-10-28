"use client";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ConfirmModal from "@/components/ConfirmModal";
import { useWallet } from "@coin98-com/wallet-adapter-react";
import { CHAIN_DATA } from "@/app/common/constant";
import { sleep } from "@/app/common/functions";
import { useAppContext } from "@/app/providers/AppProvider";

interface IFromData {
  selectedChain: string;
  onSubmit: (amount: string, type: "burn" | "mint") => void;
}

const FormData: FunctionComponent<IFromData> = ({
  selectedChain,
  onSubmit,
}) => {
  const { selectedChainId } = useWallet();

  const { activeAddress } = useAppContext();
  console.log("🚀 ~ activeAddress:", activeAddress);

  const { formState, control, handleSubmit } = useFormContext();
  const { onSwitchNetwork } = useAppContext();

  const currentChain = get(CHAIN_DATA, selectedChain);

  const textConfirm = useMemo(() => {
    return activeAddress?.chainId !== currentChain?.chainId
      ? "Switch network"
      : "Confirm";
  }, [activeAddress?.chainId, currentChain?.chainId]);

  const handleSubmitData = (type: "mint" | "burn") => async (data: any) => {
    //Check network
    if (currentChain?.chainId !== selectedChainId) {
      onSwitchNetwork(currentChain?.chainId);
    }

    // const amount = get(data, "burnMintToken.amount", 0);
    //     onSubmit(amount, type);
  };

  return (
    <form className="w-full space-y-6">
      <FormField
        control={control}
        name="burnMintToken.amount"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input 
                placeholder="Enter amount" 
                className="w-full h-10 px-3 bg-background border-input" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        rules={{
          required: "This is required!",
          validate: (value) => Number(value) > 0 || "Invalid amount",
        }}
      />

      <div className="flex mt-6 ml-auto gap-2 justify-end">
        <ConfirmModal
          handleConfirm={handleSubmit(handleSubmitData("mint"))}
          title="OK?"
          textConfirm={textConfirm}
        >
          <Button 
            variant="default"
            disabled={!isEmpty(formState.errors) || !formState.isDirty}
            className="min-w-[80px] h-9"
          >
            Mint
          </Button>
        </ConfirmModal>

        <ConfirmModal
          handleConfirm={handleSubmit(handleSubmitData("burn"))}
          title="OK?"
          textConfirm={textConfirm}
        >
          <Button
            variant="destructive" 
            disabled={!isEmpty(formState.errors) || !formState.isDirty}
            className="min-w-[80px] h-9"
          >
            Burn
          </Button>
        </ConfirmModal>
      </div>
    </form>
  );
};

export default FormData;
