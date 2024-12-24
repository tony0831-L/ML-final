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

    public async getLogBySid(Request: Request, Response: Response){
        const resp = await this.service.getLogBySid(Request.query.id as string);
        Response.status(resp.code).send(resp);
    }

    public async chat(Request: Request, Response: Response) {
        const resp = await this.service.chat(Request.body.text,Request.body);
        Response.status(resp.code).send(resp);
    }

    public async addDoc(Request: Request, Response: Response) {

        const doc = await this.service.addDoc(Request.body.url,Request.body.sid)

        const res: resp<Document<Record<string, any>>[]|undefined> = {
            code: doc?200:500,
            message: doc?"add sucess":"server error",
            body: doc
        };
        
        Response.status(res.code).send(res);
    }

    public async deleteDoc(Request: Request, Response: Response) {

        const result = this.service.deleteDoc();

        const res: resp<undefined> = {
            code: result?200:500,
            message: result?"delete sucess":"server error",
            body: undefined
        };
        
        Response.status(res.code).send(res);

    }

    public async askWithDoc(Request: Request, Response: Response) {
        const resp = await this.service.askWithDoc(Request.body.text,Request.body);
        Response.status(resp.code).send(resp);
    }


}