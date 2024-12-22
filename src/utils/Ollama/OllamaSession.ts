import { Ollama, OllamaEmbeddings, OllamaInput } from "@langchain/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import { pull } from "langchain/hub";

export class OllamaSession {
    private ollama: Ollama;
    private embeddings: OllamaEmbeddings;
    public vectorStore: MemoryVectorStore;
    

    constructor(input: OllamaInput, embeddingModel: string) {
        this.ollama = new Ollama(input);
        this.embeddings = new OllamaEmbeddings({
            model: embeddingModel, // Default value
            baseUrl: input.baseUrl, // Default value
        });
        this.vectorStore = new MemoryVectorStore(this.embeddings);

    }

    public async chat(text: string): Promise<string> {
        try {
            const completion = await this.ollama.invoke(text);
            return completion
        } catch (error) {
            throw error
        }
    }

    public async deleteDoc(){
        try {
            this.vectorStore.delete();
        } catch (error) {
            
        }
    }

    public async addDoc(doc: Document<Record<string, any>>[]){
        this.vectorStore.addDocuments(doc);
        doc.forEach(doc=>{
            console.log(doc)
        })
    }

    public async askWithDoc(text: string): Promise<string> {
        let question = text;
        const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");
        const retrievedDocs = await this.vectorStore.similaritySearch(question);
        const docsContent = retrievedDocs.map((doc) => doc.pageContent).join("\n");
        const messages = await promptTemplate.invoke({
            question: question,
            context: docsContent,
        });
        const answer = await this.ollama.invoke(messages);
        return answer;
    }

}