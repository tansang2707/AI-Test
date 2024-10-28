"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onConfirm}>{textConfirm}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmModal;
