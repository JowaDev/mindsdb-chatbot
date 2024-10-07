'use client'

import React, {ReactNode} from 'react'
import {Label} from "@/components/ui/label"
import {motion} from "framer-motion"

const variants = {
    hidden: {
        opacity: 0,
        zIndex: -1
    },
    visible: {
        opacity: 1,
        x: '-400px',
        zIndex: 0,
    }
}

interface FileUploadProps {
    visible: boolean,
    children: ReactNode
}

export default function Explorer({visible, children}: FileUploadProps) {
    return (
        <motion.div
            className="w-full h-full max-w-md mx-auto absolute bottom-0 -left-10 bg-accent rounded-lg border-dashed border-2 border-gray-600 overflow-hidden flex flex-col"
            variants={variants}
            initial="hidden"
            animate={visible ? "visible" : "hidden"}
            transition={{
                ease: 'circInOut',
            }}
        >
            <Label htmlFor="file-explorer" className="text-md font-medium text-foreground p-4 h-14 hidden">
                Explorateur de fichiers
            </Label>
            {children}
        </motion.div>
    )
}