'use client'

import React, {ChangeEvent, FormEvent, useCallback, useState, useTransition} from 'react'
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {CloudUploadIcon, FileIcon, UploadIcon} from "lucide-react"
import {motion} from "framer-motion"
import {initiateBackendAction, RAGAction} from "@/actions";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";

const variants = {
    hidden: {
        opacity: 0,
        zIndex: -1
    },
    visible: {
        opacity: 1,
        x: '400px',
        zIndex: 0,
    }
}

interface FileUploadProps {
    visible: boolean
}

export default function FileUpload({visible}: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition();

    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }, [])

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }, [])

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (file) {
            startTransition(async () => {
                const form = new FormData();
                form.append('file', file);
                const reponse = await RAGAction(form);
                if (reponse === -13) {
                    toast("Vous devez initaliser le backend !", {
                        important: true,
                        action: <Button serverAction={initiateBackendAction}>Initiate backend !</Button>
                    });
                }
                setFile(null);
            })
        }
    }, [file])

    return (
        <motion.div
            className="w-full h-full max-w-md mx-auto absolute bottom-0 -right-10 bg-accent rounded-lg"
            variants={variants}
            initial="hidden"
            animate={visible ? "visible" : "hidden"}
            transition={{
                ease: 'circInOut',
            }}
        >
            <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700 mb-2" hidden>
                Déposer un fichier
            </Label>
            <div
                className={`h-full relative border-2 border-dashed rounded-lg flex justify-center items-center ${
                    dragActive ? "border-green-600" : "border-gray-600"
                } transition-colors duration-300 ease-in-out`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <form
                    onSubmit={handleSubmit}
                    className='h-full w-full flex items-center justify-center'
                >
                    <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleChange}
                    />
                    <label
                        htmlFor="file-upload"
                        className="w-full flex flex-col items-center justify-center h-full cursor-pointer"
                    >
                        {
                            isPending ? (
                                <CloudUploadIcon className="w-8 h-8 text-primary mb-2 animate-bounce"/>
                            ) : file ? (
                                <>
                                    <FileIcon className="w-8 h-8 text-primary mb-2"/>
                                    <span className="text-sm text-gray-500">
                                        {file.name}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <UploadIcon className="w-8 h-8 text-gray-400 mb-2"/>
                                    <span className="text-sm text-gray-500">
                                        Cliquez ou déposez un fichier ici
                                    </span>
                                </>
                            )
                        }
                    </label>
                    {
                        file && (
                            <button
                                type="button"
                                className="absolute top-2 right-2"
                                onClick={() => setFile(null)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )
                    }
                    {
                        file && (
                            <button
                                type="submit"
                                className="absolute bottom-2 right-2 bg-primary text-accent px-4 py-1 rounded-lg"
                                disabled={isPending}
                            >
                                {isPending ? 'Envoi en cours...' : 'Envoyer'}
                            </button>
                        )
                    }
                </form>
            </div>
        </motion.div>
    )
}