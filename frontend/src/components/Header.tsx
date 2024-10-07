import {FC} from "react";
import {Button} from "@/components/ui/button";
import {initiateBackendAction} from "@/actions";

type HeaderProps = object

export const Header: FC<HeaderProps> = () => {
    return (
        <div
            className='absolute w-full h-16 border-b-2 border-secondary flex justify-between items-center px-4'
        >
            <span>
                HES Chatbot
            </span>
            <Button
                serverAction={initiateBackendAction}
                className='first-step'
            >
                Initiate backend
            </Button>
        </div>
    )
}