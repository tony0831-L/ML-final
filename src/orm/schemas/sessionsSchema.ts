import { model, Schema } from "mongoose";
import { Session } from "../../interfaces/Session";

export const sessionsSchema = new Schema<Session>({
    subject: {type: String, required: false},
    sid:{ type: String, required: true },
    ip:{ type: String, required: true },
    createTime:{type: String, required: true }
});

export const SessionsModel = model<Session>('sessions', sessionsSchema);