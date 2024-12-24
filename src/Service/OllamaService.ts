import { threadId } from "worker_threads";
import { Service } from "../abstract/Service";
import { resp } from "../interfaces/resp";
import { MongoDB } from "../utils/DB/MongoDB";
import { OllamaSession } from "../utils/Ollama/OllamaSession";
import { webDocParser } from "../utils/Ollama/webDocParser";
import { type MongoClient } from "mongodb";
import { Checkpoint } from "@langchain/langgraph";
import { Session } from "../interfaces/Session";

export class OllamaService extends Service {

    private ollamaSession: OllamaSession | undefined;

    constructor() {

        super();

        if (MongoDB.getClient() != undefined) {
            this.ollamaSession = new OllamaSession(
                {
                    model: "llama3.2:latest", // Default value
                    temperature: 0,
                    maxRetries: 2,
                    baseUrl: process.env.OllamaEndPoint
                },
                "mxbai-embed-large",
                MongoDB.getClient() as unknown as MongoClient
            );
        }else{
            console.log("not init")
        }

    };

    public async addDoc(url: string,sid:string) {
        if (this.ollamaSession) {
            const doc = await webDocParser(url);
            this.ollamaSession.addDoc(doc,sid);
            return doc;
        }
    }

    public deleteDoc():boolean {
        if (this.ollamaSession) {
            this.ollamaSession.deleteDoc()
            return true
        }else{
            return false
        }
    }

    public async chat(text: string,session:Session): Promise<resp<string | undefined>> {

        const res: resp<any> = {
            code: 200,
            message: "",
            body: undefined
        };

        if (this.ollamaSession) {

            try {

                const completion = await this.ollamaSession.chat(text,session);
                res.body = completion;
                res.message = "ok";

            } catch (error) {

                res.message = error as string;
                res.code = 500;

            }

        } else {

            res.message = "server error";
            res.code = 500;

        }

        return res
    }

    public async askWithDoc(text: string,session:Session): Promise<resp<any>> {

        const res: resp<any> = {
            code: 200,
            message: "",
            body: undefined
        };

        if (this.ollamaSession) {

            try {
                const completion = await this.ollamaSession.askWithDoc(text,session);
                res.body = completion;
                res.message = "ok";
            } catch (error) {
                res.message = error as string;
                res.code = 500;
            }

        } else {
            
            res.message = "server error";
            res.code = 500;

        }

        return res

    }

    public async getLogBySid(sid:string){

        const res:resp<unknown> = {
            code: 200,
            message: "",
            body: undefined
        }

        const log = await this.ollamaSession?.getLogBySid(sid);
        res.body = log?.channel_values.messages

        return res;
    }
}