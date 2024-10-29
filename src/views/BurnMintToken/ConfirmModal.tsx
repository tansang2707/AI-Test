"use client";
import React, { FunctionComponent, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface IConfirmModal {
  title: string;
  children: React.ReactNode;
  description?: string;
  textConfirm?: string;
  textCancel?: string;
  isLoading?: boolean;
  hash: string;
  url: string;
  handleConfirm: (callback?: () => void) => void;
  handleClose: () => void;
}

const ConfirmModal: FunctionComponent<IConfirmModal> = ({
  title,
  children,
  description,
  textConfirm = "Confirm",
  textCancel = "Cancel",
  isLoading,
  hash = "",
  url,
  handleConfirm,
  handleClose,
}) => {
  const [open, setOpen] = useState(false);

  const onConfirm = () => {
    if (!hash) {
      handleConfirm();
    } else {
      if (url) {
        window.open(url, "_blank");
      }
      setOpen(false);
    }
  };

  const onClose = () => {
    handleClose()
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={onClose} variant={"secondary"}>
            {textCancel}
          </Button>

          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : hash ? (
              "Explore"
            ) : (
              textConfirm
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
