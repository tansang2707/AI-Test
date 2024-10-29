"use client";
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "./ui/alert-dialog";

interface ConfirmModalProps {
  children: React.ReactNode;
  title: string;
  textConfirm: string;
  handleConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  children,
  title,
  textConfirm,
  handleConfirm,
}) => {
  const [open, setOpen] = React.useState(false);

  const onConfirm = async () => {
    await handleConfirm();
    setOpen(false);
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {/* <div onClick={() => setOpen(true)}>{children}</div> */}
          {children}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConfirmModal;
