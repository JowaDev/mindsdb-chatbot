import {Container} from "@/components/Container";
import {Chatbot} from "@/components/Chatbot";
import {List, ListSkeleton} from "@/components/Explorer/List";
import {Suspense} from "react";
import { unstable_noStore as noStore } from 'next/cache';

export default async function Home() {
    noStore();
    return (
        <Container>
            <div
                className='relative w-full h-screen mx-auto flex flex-col items-center justify-center'
            >
                <Chatbot>
                    <Suspense
                        fallback={<ListSkeleton/>}
                    >
                        <List/>
                    </Suspense>
                </Chatbot>
            </div>
        </Container>
    );
}
