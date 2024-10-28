'use client'
import React, { FunctionComponent } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface IConfirmModal {
  title: string;
  children: React.ReactNode;
  description?: string;
  textConfirm?: string;
  textCancel?: string;
  handleConfirm: () => void;
}

const ConfirmModal: FunctionComponent<IConfirmModal> = ({
  title,
  children,
  description,
  textConfirm = "Confirm",
  textCancel = "Cancel",
  handleConfirm,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{textCancel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {textConfirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
