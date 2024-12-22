import { Contorller } from "../abstract/Contorller";
import { Request, Response } from "express";
import { logger } from "../middlewares/log";
import { Document } from "@langchain/core/documents";
import { OllamaService } from "../Service/OllamaService";
import { resp } from "../interfaces/resp";
require('dotenv').config()

export class OllamaController extends Contorller {
    protected service: OllamaService;

    constructor() {
        super();
        this.service = new OllamaService();
    }

    public async chat(Request: Request, Response: Response) {
        const resp = await this.service.chat(Request.body.text);
        console.log("fin res");
        Response.status(resp.code).send(resp);
    }

    public async addDoc(Request: Request, Response: Response) {

        const res: resp<Document<Record<string, any>>[]> = {
            code: 200,
            message: "add sucess",
            body: await this.service.addDoc(Request.body.url)
        };
        
        Response.status(res.code).send(res);
    }

    public async deleteDoc(Request: Request, Response: Response) {
        const res: resp<undefined> = {
            code: 200,
            message: "delete sucess",
            body: undefined
        }
        this.service.deleteDoc();
        Response.status(res.code).send(res);
    }

    public async askWithDoc(Request: Request, Response: Response) {
        const resp = await this.service.askWithDoc(Request.body.text);
        Response.status(resp.code).send(resp);
    }


}