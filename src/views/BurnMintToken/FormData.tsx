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
import ConfirmModal from "./ConfirmModal";
import { CHAIN_DATA } from "@/common/constant";
import { useAppContext } from "@/providers/AppProvider";
import { upperCaseFirstLetter } from "@/common/functions";

interface IFromData {
  currentToken: string;
  selectedChain: string;
  isLoading: boolean;
  hash: string;
  onClearHash: () => void;
  onToogleLoading: (value: boolean) => void;
  onSubmit: (
    amount: string,
    type: "burn" | "mint",
    callback?: () => void
  ) => void;
}

const FormData: FunctionComponent<IFromData> = ({
  currentToken,
  selectedChain,
  isLoading,
  hash,
  onClearHash,
  onToogleLoading,
  onSubmit,
}) => {
  const { activeAddress } = useAppContext();

  const { formState, control, handleSubmit, getValues } = useFormContext();
  const { onSwitchNetwork } = useAppContext();

  const currentChain = get(CHAIN_DATA, selectedChain);

  const textConfirm = useMemo(() => {
    return activeAddress?.chainId !== currentChain?.chainId
      ? "Switch network"
      : "Confirm";
  }, [activeAddress?.chainId, currentChain?.chainId]);

  const successDescription = useMemo(() => {
    if (!hash) return "";
    return `View on ${upperCaseFirstLetter(
      currentChain?.scan?.split("://")?.[1]?.split(".")?.[0]
    )}`;
  }, [hash, currentChain]);

  const url = useMemo(() => {
    if (!hash) return "";
    return `${currentChain.scan}/tx/${hash}`;
  }, [hash, currentChain]);

  const getDescriptionConfirm = (type: string) => {
    return `Are you sure to ${type.toUpperCase()} ${
      getValues(`burnMintToken.amount`) || 0
    } ${currentToken === "c98" ? "C98" : "Saros"}`;
  };

  const handleSubmitData =
    (type: "mint" | "burn", callback?: () => void) => async (data: any) => {
      onToogleLoading(true);
      //Check network
      if (currentChain?.chainId !== activeAddress?.chainId && onSwitchNetwork) {
        await onSwitchNetwork(currentChain?.chainId);
        onToogleLoading(false);
        return;
      }

      const amount = get(data, "burnMintToken.amount", 0);
      onSubmit(amount, type, callback);
    };

  const handleConfirm = (type: "mint" | "burn") => () => {
    handleSubmit(handleSubmitData(type))();
  };

  const handleClose = () => {
    onToogleLoading(false);
    onClearHash();
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
          handleConfirm={handleConfirm("mint")}
          title="Mint"
          description={successDescription || getDescriptionConfirm("mint")}
          textConfirm={textConfirm}
          isLoading={isLoading}
          handleClose={handleClose}
          hash={hash}
          url={url}
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
          title="Burn"
          handleConfirm={handleConfirm("burn")}
          description={successDescription || getDescriptionConfirm("burn")}
          textConfirm={textConfirm}
          isLoading={isLoading}
          hash={hash}
          handleClose={handleClose}
          url={url}
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
