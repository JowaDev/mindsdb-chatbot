import {revalidatePath} from "next/cache";

const baseUrl = process.env.MINDSDB_URL_ENDPOINT;

export async function runMindsDBQueries() {
    try {
        // Connexion à MindsDB (cette partie est généralement gérée en interne par l'API)
        console.log('Connected to MindsDB');

        // Créer un moteur ML OpenAI
        const createMlEngineResponse = await fetch(`${baseUrl}/sql/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    CREATE ML_ENGINE openai_engine 
                    FROM openai 
                    USING openai_api_key = '${process.env.OPENAI_API_KEY}';
                `
            })
        });
        const createMlEngine = await createMlEngineResponse.json();
        console.log('ML Engine created:', createMlEngine);

        // Créer un modèle d'embedding avec OpenAI
        const createEmbeddingModelResponse = await fetch(`${baseUrl}/sql/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    CREATE MODEL embedding_model 
                    PREDICT embeddings 
                    USING engine = 'openai_engine', 
                    mode = 'embedding', 
                    model_name = 'text-embedding-ada-002', 
                    question_column = 'content';
                `
            })
        });
        const createEmbeddingModel = await createEmbeddingModelResponse.json();
        console.log('Embedding model created:', createEmbeddingModel);

        // Créer une Knowledge Base
        const createKnowledgeBaseResponse = await fetch(`${baseUrl}/sql/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    CREATE KNOWLEDGE BASE my_knowledge_base 
                    USING model = embedding_model;
                `
            })
        });
        const createKnowledgeBase = await createKnowledgeBaseResponse.json();
        console.log('Knowledge Base created:', createKnowledgeBase);

        // Créer une skill basée sur la Knowledge Base
        const createKbSkillResponse = await fetch(`${baseUrl}/sql/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    CREATE SKILL kb_skill 
                    USING type = 'knowledge_base', 
                    source = 'my_knowledge_base', 
                    description = 'Données HES pour répondre aux questions des étudiants';
                `
            })
        });
        const createKbSkill = await createKbSkillResponse.json();
        console.log('Knowledge Base skill created:', createKbSkill);

        // Créer un agent avec GPT-4 et la skill Knowledge Base
        const createAgentResponse = await fetch(`${baseUrl}/sql/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    CREATE AGENT hes_chatbot_agent 
                    USING provider = 'openai', 
                    model = 'gpt-3.5-turbo', 
                    openai_api_key = '${process.env.OPENAI_API_KEY}', 
                    skills = ['kb_skill'], 
                    prompt_template = "Utilisez les données disponibles de l'HES pour répondre de manière utile aux questions des utilisateurs.", 
                    verbose = True, 
                    max_tokens = 100;
                `
            })
        });
        const createAgent = await createAgentResponse.json();
        console.log('Agent created:', createAgent);
    } catch (error) {
        console.log('Error:', error);
    }
}

export async function uploadFileThenEmbed(form: FormData) {
    try {

        const file = form.get('file') as File;

        const uploadFileResponse = await fetch(`${baseUrl}/files/${file.name}`, {
            method: 'PUT',
            body: form
        });

        if (uploadFileResponse.ok) {

            const insertFileResponse = await fetch(`${baseUrl}/sql/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                    INSERT INTO my_knowledge_base (
                        SELECT content FROM files.\`${file.name}\`
                    );
                    `
                })
            });

            if (!insertFileResponse.ok) {
                console.error('Error inserting file:', insertFileResponse.statusText);
            }

            revalidatePath('/');

        } else {
            console.log('Error uploading file:', await uploadFileResponse.json());
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

export async function runQueryAgent(question: string) {
    if (!question) {
        throw new Error('La question doit être une chaîne de caractères non vide.');
    }

    try {
        const queryAgentResponse = await fetch(`${process.env.MINDSDB_URL_ENDPOINT}/sql/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `SELECT * FROM hes_chatbot_agent WHERE question = "${question}";`
            })
        });

        if (!queryAgentResponse.ok) {
            throw new Error(`Erreur réseau: ${queryAgentResponse.status}`);
        }

        const queryAgent = await queryAgentResponse.json();
        console.log('Agent response:', queryAgent);
        return queryAgent;
    } catch (error) {
        console.error('Erreur lors de la requête à MindsDB:', error);
        throw error;
    }
}

export async function getFiles() {
    try {
        const getFilesResponse = await fetch(`${baseUrl}/files`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const files = await getFilesResponse.json();
        console.log(files);
        return files;
    } catch (error) {
        console.log('Error:', error);
    }
}

export async function removeFile(fileName: string) {
    try {
        const removeFileResponse = await fetch(`${baseUrl}/files/${fileName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const removeFile = await removeFileResponse.json();
        console.log('removeFile:', removeFile);

        if (!removeFileResponse.ok) {
            throw new Error(`Erreur réseau: ${await removeFileResponse.json()}`);
        }

        await removeAllKnowledge();
        await addAllKnowledge();
        revalidatePath('/');
    } catch (error) {
        console.log('Error:', error);
    }
}

export async function checkExistingKnowledge(fx: (arg: any) => Promise<void>, arg?: any) {
    try {
        const responseKnowledgeBase = await fetch(`${baseUrl}/sql/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    SELECT id FROM my_knowledge_base;
                `
            })
        });
        const knowledgeBase = await responseKnowledgeBase.json();
        console.log('knowledgeBase:', knowledgeBase);

        return knowledgeBase.type !== 'error' ? await fx(arg && arg) : -13;
    } catch (error) {
        console.log('Error:', error);
    }
}

async function removeAllKnowledge() {
    try {
        const responseKnowledgeBase = await fetch(`${baseUrl}/sql/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    SELECT id FROM my_knowledge_base;
                `
            })
        });
        const knowledgeBase = await responseKnowledgeBase.json();
        console.log('knowledgeBase:', knowledgeBase);

        const ids = knowledgeBase.data.map((file: string[]) => file[0]);
        if (ids.length > 0) {
            for (const id of ids) {
                const removeKnowledgeResponse = await fetch(`${baseUrl}/sql/query`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                        DELETE FROM my_knowledge_base WHERE id = '${id}';
                        `
                    })
                });

                if (!removeKnowledgeResponse.ok) {
                    console.error('Error removing knowledge:', removeKnowledgeResponse.statusText);
                }
            }
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

async function addAllKnowledge() {
    try {
        const files = await getFiles();
        if (files.length > 0) {
            for (const file of files) {
                const insertFileResponse = await fetch(`${baseUrl}/sql/query`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                        INSERT INTO my_knowledge_base (
                            SELECT content FROM files.\`${file.name}\`
                        );
                        `
                    })
                });

                if (!insertFileResponse.ok) {
                    console.error('Error inserting file:', insertFileResponse.statusText);
                }
            }
        } else {
            console.log('No files to add to knowledge base');
        }
    } catch (error) {
        console.log('Error:', error);
    }
}