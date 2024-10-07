'use client'

import React, {FC, useTransition} from "react";
import {ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu";
import {FileIcon, TrashIcon} from "lucide-react";
import {FileType} from "@/components/Explorer/List";
import {initiateBackendAction, removeFileAction} from "@/actions";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";

interface ContextFileProps {
    file: FileType
}

export const ContextFile: FC<ContextFileProps> = ({file}) => {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async (name: string) => {
        startTransition(async () => {
            const response = await removeFileAction(name)
            if (response === -13) {
                toast("Vous devez initaliser le backend !", {
                    important: true,
                    action: <Button serverAction={initiateBackendAction}>Initiate backend !</Button>
                });
            }
        });
    }

    return (
        <>
            <ContextMenuTrigger>
                <div className="flex flex-col items-center">
                    <FileIcon className="w-12 h-12 text-gray-500"/>
                    <span className="mt-2 text-sm text-center break-all">{file.name}</span>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={() => handleDelete(file.name)}>
                    <TrashIcon className="mr-2 h-4 w-4"/>
                    <span>
                        {
                            isPending ? 'Suppression...' : 'Supprimer'
                        }
                    </span>
                </ContextMenuItem>
            </ContextMenuContent>
        </>
    )
}