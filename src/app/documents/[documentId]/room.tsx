"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";

export function Room({ children }: { children: ReactNode }) {

    const params = useParams();
    return (
        <LiveblocksProvider publicApiKey={"pk_dev_O-lNPY2TTUbl9scT3ztRVvaihQB90Fm_CL1HjL0S690ARC0rJ8qHa2WuqB4PZ_dW"}>
        <RoomProvider id={params.documentId as string}>
            <ClientSideSuspense fallback={<div>Loading…</div>}>
            {children}
            </ClientSideSuspense>
        </RoomProvider>
        </LiveblocksProvider>
    );
}