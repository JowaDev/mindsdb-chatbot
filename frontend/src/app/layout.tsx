'use client';

import localFont from "next/font/local";
import "./globals.css";
import {ThemeProvider} from "@/components/ThemeProvider";
import {ReactNode} from "react";
import {Steps, StepsProps} from "intro.js-react";
import {Header} from "@/components/Header";
import {Toaster} from "@/components/ui/sonner";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

const steps: StepsProps["steps"] = [
    {
        element: '.first-step',
        intro: (
            <>
                <ul
                    className='list-disc list-inside'
                >
                    <li>Connexion à MindsDB</li>
                    <li>Création d&apos;un LLM engine OpenAI</li>
                    <li>Création d&apos;un modèle d&apos;embedding</li>
                    <li>Création d&apos;une Knowledge Base</li>
                    <li>Création d&apos;un skill de type knowledge base</li>
                    <li>Création d&apos;un agent GPT-4 avec un skill</li>
                </ul>
            </>
        ),
        position: 'left',
        title: "Création d'un agent GPT-4",
    },
    {
        element: '.second-step',
        intro: (
            <>
                <p>
                    Il s&apos;agit du Chatbot qui vous permettra de communiquer avec l&apos;agent GPT-4.
                </p>
            </>
        ),
        position: 'left',
        title: 'Module principal',
    },
    {
        element: '.third-step',
        intro: (
            <>
                <p
                    className='mb-4'
                >
                    Deux sous-modules sont disponibles lorsque vous cliquez sur le bouton :
                </p>
                <ul
                    className='list-disc list-inside'>
                    <li>
                        À droite, le système pour upload des fichiers dans le backend et
                        démarrer le processus d&apos;embedding, c&apos;est à dire que le modèle d&apos;embedding va
                        transformer le fichier en vecteurs.
                    </li>
                    <li>
                        À gauche, l&apos;explorateur de fichiers. Il permet de naviguer dans les fichiers disponibles
                        sur le serveur, vous pouvez supprimer un fichier <span
                        className='animate-pulse'>(clique droit)</span> et il sera aussi supprimé de la base de
                        données vectorielle (Knowledge Base).
                    </li>
                </ul>
            </>
        ),
        position: 'left',
        title: 'Module de génération augmentée par récupération (RAG)',
    },
];

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <Steps
                enabled={true}
                steps={steps}
                initialStep={0}
                onExit={() => void 0}
            />
            <Header/>
            {children}
            <Toaster/>
        </ThemeProvider>
        </body>
        </html>
    );
}
