"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface UpdateStatusConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionLabel: string;
  isDestructive?: boolean;
}

export function UpdateStatusConfirmationDialog({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title,
    description,
    actionLabel,
    isDestructive = false
}: UpdateStatusConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={isDestructive ? buttonVariants({ variant: "destructive" }) : ""}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// buttonVariants is not exported from button.tsx. We can define a simplified version here for styling.
const buttonVariants = ({ variant }: { variant: string }) => {
    if (variant === 'destructive') {
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    }
    return "";
};
