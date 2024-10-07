'use server'

import {checkExistingKnowledge, removeFile, runMindsDBQueries, runQueryAgent, uploadFileThenEmbed} from "@/lib/mindsdb";
import {unstable_noStore as noStore} from 'next/cache';

export async function initiateBackendAction() {
    noStore();
    await runMindsDBQueries();
}

export async function askAgentAction(question: string) {
    noStore();
    return await checkExistingKnowledge(runQueryAgent, question);
}

export async function RAGAction(form: FormData) {
    noStore();
    return await checkExistingKnowledge(uploadFileThenEmbed, form);
}

export async function removeFileAction(fileName: string) {
    noStore();
    return await checkExistingKnowledge(removeFile, fileName);
}