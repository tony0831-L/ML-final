import { Contorller } from "../abstract/Contorller";
import { Request, response, Response } from "express";
import { UserService } from "../Service/UserService";
import { Session } from "../interfaces/Session";
import { sign } from "jsonwebtoken";
import { DBResp } from "../interfaces/DBResp";
import { resp } from "../interfaces/resp";


require('dotenv').config()

export class UserController extends Contorller {
    protected service: UserService;

    constructor() {
        super();
        this.service = new UserService();
    }

    public async findAll(Request: Request, Response: Response) {
        const resp = await this.service.getAllSessions();
        Response.status(resp.code).send(resp)
    }


    public async insertOne(Request: Request, Response: Response) {

        const userIp = Request.headers['x-real-ip'] || Request.headers['x-forwarded-for'] || Request.ip;

        let res: resp<DBResp<Session> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        sign(userIp, process.env.privateKey as string, { algorithm: 'HS512' }, async (err, token) => {
            if (err) {
                res.code = 500;
                res.message = "server error";
                Response.status(500).send(res);
            } else {

                const session: Session = {
                    sid: token as string + (Request.query.id as string),
                    ip: (userIp as string).replace('::ffff:',''),
                    createTime: new Date().toLocaleString()
                };

                res = await this.service.insertSession(session);
                Response.status(res.code).send(res);
            }
        });
    }

    /**
     * findByIp
     * @param ip 
     * @param session 
     */
    public async findByIp(Request: Request, Response: Response) {
        let userIp = Request.headers['x-real-ip'] || Request.headers['x-forwarded-for'] || Request.ip;
        userIp = (userIp as string).replace('::ffff:','')
        const resp = await this.service.findByIp(userIp as string)
        Response.status(resp.code).send(resp)
    }

    /**
     * findById
     * @param id 
     * @param session 
     */
    public async findById(Request: Request, Response: Response) {
        const resp = await this.service.findById(Request.query.id as string)
        Response.status(resp.code).send(resp)
    }

    /**
    * setTitle
    * @param id, title 
    * @param session 
    */
    public async setTitle(Request: Request, Response: Response) {
        const resp = await this.service.setTitle(Request.body.id as string, Request.body.title as string)
        Response.status(resp.code).send(resp)
    }

}