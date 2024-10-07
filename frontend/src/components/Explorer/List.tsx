import {FC} from "react";
import {getFiles} from "@/lib/mindsdb";
import {ContextMenu} from "@/components/ui/context-menu";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ContextFile} from "@/components/Explorer/ContextFile";
import {Skeleton} from "@/components/ui/skeleton";
import {unstable_noStore as noStore} from 'next/cache';


type ListProps = object

export type FileType = {
    name: string
}

export const List: FC<ListProps> = async () => {
    noStore();
    const files: FileType[] = await getFiles();
    return (
        <ScrollArea className="flex-grow w-full p-4 h-full">
            <div className="grid grid-cols-3 gap-4">
                {
                    files && files.length ? files.map((file: FileType) => (
                        <ContextMenu key={file.name}>
                            <ContextFile file={file}/>
                        </ContextMenu>
                    )) : null
                }
            </div>
            {
                files && files.length === 0 ? (
                    <div
                        className='flex items-center justify-center h-full'
                    >
                        <p className='text-gray-500'>Aucun fichier</p>
                    </div>
                ) : null
            }
        </ScrollArea>
    );
}

export const ListSkeleton: FC = () => (
    <ScrollArea className="flex-grow w-full p-4">
        <div className="grid grid-cols-3 gap-4">
            {Array.from({length: 9}).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                    <Skeleton className="w-12 h-12 rounded"/>
                    <Skeleton className="h-4 w-20 mt-2"/>
                </div>
            ))}
        </div>
    </ScrollArea>
)