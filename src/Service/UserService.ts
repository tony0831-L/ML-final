import { Service } from "../abstract/Service";
import { Document } from "mongoose"
import { DBResp } from "../interfaces/DBResp";
import { resp } from "../interfaces/resp";
import { SessionsModel } from "../orm/schemas/sessionsSchema";
import { Session } from "../interfaces/Session";

export class UserService extends Service {

    /**
     * getAllSessions 
     * @returns Sessions
     */
    public async getAllSessions(): Promise<resp<Array<DBResp<Session>> | undefined>> {

        const res: resp<Array<DBResp<Session>> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        try {
            res.body = await SessionsModel.find({});
            res.message = "find sucess"
        } catch (error) {
            res.message = error as string;
            res.code = 500;
        }

        return res;
    };

    /**
     * insertSession
     * @param session new Session
     * @returns resp<Session>
     */
    public async insertSession(session: Session): Promise<resp<DBResp<Session> | undefined>> {

        const res: resp<DBResp<Session> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        try {
            const newSession = new SessionsModel({
                ...session
            });

            const resp = await newSession.save();

            res.message = "insert sucess";

            res.body = resp;

        } catch (error) {
            res.message = error as string;
            res.code = 500;
        }

        return res;
    };

    /**
     * findByIp
     * @param ip 
     * @param session 
     */
    public async findByIp(ip: string): Promise<resp<Array<DBResp<Session>> | null>> {

        const res: resp<Array<DBResp<Session>> | null> = {
            code: 200,
            message: "",
            body: null
        };

        try {
            const session = await SessionsModel.find({ ip: ip });
            if (session) {
                res.body = session;
                res.message = "find one";
            } else {
                res.message = "ip not match any";
                res.code = 404;
            };

        } catch (error) {
            res.message = error as string;
            res.code = 500;
        };

        return res;
    };

    /**
     * findById
     * @param id 
     * @param session 
     */
    public async findById(id: string): Promise<resp<DBResp<Session> | null>> {

        const res: resp<DBResp<Session> | null> = {
            code: 200,
            message: "",
            body: null
        };

        try {
            const session = await SessionsModel.findById(id);
            if (session) {
                res.body = session;
                res.message = "find one";
            } else {
                res.message = "ip not match any";
                res.code = 404;
            };

        } catch (error) {
            res.message = error as string;
            res.code = 500;
        };

        return res;
    };

    public async setTitle(id:string, title:string){

        const res: resp<DBResp<Session> | null> = {
            code: 200,
            message: "",
            body: null
        };

        try {
            const session = await SessionsModel.findById(id);
            if (session) {
                session.subject = title;
                await session.save();
                res.body = session;
                res.message = "update sucess";
            } else {
                res.message = "ip not match any";
                res.code = 404;
            };

        } catch (error) {
            res.message = error as string;
            res.code = 500;
        };

        return res;

    }

}