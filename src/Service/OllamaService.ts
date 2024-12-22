import { Service } from "../abstract/Service";
import { resp } from "../interfaces/resp";
import { OllamaSession } from "../utils/Ollama/OllamaSession";
import { webDocParser } from "../utils/Ollama/webDocParser";

export class OllamaService extends Service {

    private ollamaSession: OllamaSession;

    constructor() {

        super();

        this.ollamaSession = new OllamaSession({
            model: "taide8b:latest", // Default value
            temperature: 0,
            maxRetries: 2,
            baseUrl: process.env.OllamaEndPoint
        }, "mxbai-embed-large");

    };

    public async addDoc(url: string) {
        const doc = await webDocParser(url);
        this.ollamaSession.addDoc(doc);
        return doc;
    }

    public async deleteDoc() {
        this.ollamaSession.deleteDoc()
    }

    public async chat(text: string): Promise<resp<string | undefined>> {

        const res: resp<string | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        try {
            const completion = await this.ollamaSession.chat(text);
            res.body = completion;
            res.message = "ok";
        } catch (error) {
            res.message = error as string;
            res.code = 500;
        }

        return res
    }

    public async askWithDoc(text: string): Promise<resp<string | undefined>> {
        const res: resp<string | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        try {
            const completion = await this.ollamaSession.askWithDoc(text);
            res.body = completion;
            res.message = "ok";
        } catch (error) {
            res.message = error as string;
            res.code = 500;
        }

        return res
    }

}