import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presentationTitle: string;
  onConfirm: () => void;
}

const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  presentationTitle,
  onConfirm,
}: DeleteConfirmationDialogProps) => {
  const [confirmText, setConfirmText] = useState("");

  const handleConfirm = () => {
    if (confirmText === presentationTitle) {
      onConfirm();
      setConfirmText("");
      onOpenChange(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setConfirmText("");
    }
    onOpenChange(isOpen);
  };

  const isMatch = confirmText === presentationTitle;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-background border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Delete Presentation
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            This action cannot be undone. This will permanently delete the presentation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-3 py-4">
          <Label htmlFor="confirm-title" className="text-sm text-muted-foreground">
            Type <span className="font-semibold text-foreground">"{presentationTitle}"</span> to confirm:
          </Label>
          <Input
            id="confirm-title"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Enter presentation name"
            className="bg-card border-border"
            autoComplete="off"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-border text-muted-foreground hover:bg-muted">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isMatch}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
