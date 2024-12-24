import { Schema, model, connect, Mongoose } from 'mongoose';
import { MongoInfo } from '../../interfaces/MongoInfo';
import { logger } from '../../middlewares/log';

export class MongoDB {
    
    static DB: Mongoose | void
    static isConneted : boolean = false;

    static async init(info: MongoInfo) {

        const url = `mongodb://${info.name}:${encodeURIComponent(info.password)}@${info.host}:${info.port}/${info.dbName}`;
        
        let error:any;

        MongoDB.DB = await connect(url).catch(err=>{
            logger.error(`error: cannt connet to mongoDB ${err}`);
            error = err;
        });

        if (!error) {
            logger.info(`suscess: connet to mongoDB @${url}`);
        }
        
    }

    static getClient(){
        if (this.DB) {
            return this.DB.connection.getClient();
        }else{
            logger.info("not init")
        }
    }

    static getState():boolean{
        return this.isConneted;
    }
}

