"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog"


interface RenameDialogProps {
    documentId: Id<"documents">;
    initialTitle: string;
    children: React.ReactNode;
};
 
export const RenameDialog = ({ documentId, children, initialTitle }:RenameDialogProps) => {

    const update = useMutation(api.documents.updateById);
    const [isUpdating, setIsUpdating] = useState(false);

    const [title, setTitle] = useState(initialTitle);
    const [open, setOpen] = useState(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);

        update({ id: documentId, title: title.trim() || "Untitled"})
        .then(() => toast.success("Document updated"))
        .catch(() => toast.error("You don't have permission"))
        .finally(() => {
            setIsUpdating(false);
            setOpen(false);
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Rename document</DialogTitle>
                        <DialogDescription>
                            Enter a new name for this document
                        </DialogDescription>
                    </DialogHeader>
                    <div className="my-4">
                        <Input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Document name"
                        onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                        type="button"
                        variant="ghost"
                        className="border"
                        disabled={isUpdating}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(false);
                        }}
                        >
                            Cancel
                        </Button>
                        <Button
                        type="submit"
                        disabled={isUpdating}
                        onClick={(e) => e.stopPropagation()}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
