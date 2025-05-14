"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog"

interface RemoveDialogProps {
    documentId: Id<"documents">;
    children: React.ReactNode;
};
 
export const RemoveDialog = ({ documentId, children }:RemoveDialogProps) => {

    const remove = useMutation(api.documents.removeById);
    const [isRemoving, setIsRemoving] = useState(false);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This document will be permanently deleted from your account.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                        disabled={isRemoving}
                        onClick={(e)=> {
                            e.stopPropagation();
                            setIsRemoving(true);
                            remove({ id: documentId})
                            .finally(()=> setIsRemoving(false))
                        }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
