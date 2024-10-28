"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Add basic Dialog exports and styled components
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = DialogPrimitive.Content;
export const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
);
export const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex justify-end space-x-2", className)} {...props} />
);
export const DialogTitle = DialogPrimitive.Title;
