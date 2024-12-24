import { Ollama, OllamaEmbeddings, OllamaInput } from "@langchain/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import { pull } from "langchain/hub";
import { Annotation, END, InMemoryStore, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { type MongoClient } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import { ragGraph } from "./agents/ragGraph";
import { chatGraph } from "./agents/chatGraph";
import { Session } from "../../interfaces/Session";

export class OllamaSession {

    public ollama: Ollama;
    public embeddings: OllamaEmbeddings;
    public checkpointer: MongoDBSaver;
    public store: InMemoryStore;
    public vectorStore: MemoryVectorStore;
    public MemorySaver: MemorySaver;

    constructor(input: OllamaInput, embeddingModel: string, mongoClient: MongoClient) {

        this.ollama = new Ollama(input);

        this.embeddings = new OllamaEmbeddings({
            model: embeddingModel,
            baseUrl: input.baseUrl,
        });

        this.store = new InMemoryStore();

        this.vectorStore = new MemoryVectorStore(this.embeddings);

        this.checkpointer = new MongoDBSaver({
            client: mongoClient,
        });

        this.MemorySaver = new MemorySaver();

    }

    public async chat(text: string,session:Session) {
        const graph = await chatGraph(this)
        const res = await graph.invoke(
            {
                messages: [
                    {
                        role: "user",
                        content: text
                    }
                ]
            },
            {
                configurable: {
                    thread_id:session.sid,
                    userId:session.ip
                }
            }
        );
        return res
    }

    public async deleteDoc() {
        try {
            this.vectorStore.delete();
        } catch (error) {
        }
    }

    public async addDoc(doc: Document<Record<string, any>>[],sid:string) {
        doc.forEach((doc)=>{
            doc.metadata.sid = sid
        })
        this.vectorStore.addDocuments(doc);
    }

    public async askWithDoc(text: string,session:Session) {

        const graph = await ragGraph(this);

        const res = await graph.invoke(
            {
                sid: session.sid,
                question: text
            },
            {
                configurable: {
                    thread_id:session.sid,
                    userId:session.ip
                }
            }
        );

        return res
    }

    public async getLogBySid(sid:string){
        const his = await this.checkpointer.get({configurable:{thread_id:sid}})
        return his
    }

}