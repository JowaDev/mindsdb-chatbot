'use client'

import React, {FC, FormEvent, ReactNode, useState} from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {FolderPenIcon, SendIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {askAgentAction, initiateBackendAction} from "@/actions";
import FileUpload from "@/components/FileUpload";
import Explorer from "@/components/Explorer/Explorer";
import {toast} from "sonner";

interface ChatbotProps {
    children: ReactNode;
}

interface Message {
    content: string;
    sender: 'user' | 'bot';
}

const MessageSkeleton: FC = () => (
    <div className="flex items-start space-x-4 mb-4">
        <Skeleton className="w-8 h-8 rounded-full"/>
        <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]"/>
            <Skeleton className="h-4 w-[160px]"/>
        </div>
    </div>
);

export const Chatbot: FC<ChatbotProps> = ({children}) => {
    const [messages, setMessages] = useState<Message[]>([
        {content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", sender: 'bot'}
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [explorerVisible, setExplorerVisible] = useState(false);

    const handleSend = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            setMessages(prev => [...prev, {content: input, sender: 'user'}]);
            setInput('');
            setIsLoading(true);

            try {
                const botResponse = await askAgentAction(input) as any;

                if (botResponse !== -13) {
                    if (botResponse.type === 'error') {
                        setMessages(prev => [...prev, {
                            content: `Erreur: ${botResponse.error_message}`,
                            sender: 'bot'
                        }]);
                    } else {
                        setMessages(prev => [...prev, {content: botResponse.data[0][0], sender: 'bot'}]);
                    }
                } else {
                    toast("Vous devez initaliser le backend !", {
                        important: true,
                        action: <Button serverAction={initiateBackendAction}>Initiate backend !</Button>
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la communication avec le chatbot:', error);
                setMessages(prev => [...prev, {content: "Désolé, une erreur s'est produite.", sender: 'bot'}]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Card className="w-[350px] second-step">
            <div
                className='relative h-full w-full'
            >
                <FileUpload
                    visible={explorerVisible}
                />
                <Explorer
                    visible={explorerVisible}
                >
                    {children}
                </Explorer>
                <CardHeader>
                    <CardTitle
                        className='flex justify-between items-center'
                    >
                        Chatbot
                        <div
                            className='flex gap-2'
                        >
                            <Button
                                type="button"
                                size="icon"
                                onClick={() => setExplorerVisible(prevState => !prevState)}
                            >
                                <FolderPenIcon className="h-4 w-4 third-step"/>
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px]">
                        {messages.map((message, index) => (
                            <div key={index}
                                 className={`mb-4 ${message.sender === 'bot' ? 'text-left' : 'text-right'}`}>
                                <div
                                    className={`inline-block p-2 rounded-lg ${
                                        message.sender === 'bot'
                                            ? 'bg-secondary text-secondary-foreground'
                                            : 'bg-primary text-primary-foreground'
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && <MessageSkeleton/>}
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <form onSubmit={handleSend} className="flex w-full gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Tapez votre message..."
                            className="flex-grow"
                        />
                        <Button type="submit" size="icon">
                            <SendIcon className="h-4 w-4"/>
                        </Button>
                    </form>
                </CardFooter>
            </div>
        </Card>
    );
};
