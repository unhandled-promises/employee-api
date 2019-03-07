import { Schema } from "mongoose";
import { MailData } from '@sendgrid/helpers/classes/mail';

export declare module App {
    export interface Employee {
        access_token: string | null;
        company: Schema.Types.ObjectId;
        device: {
            id: String | null;
            type: String | null;
        }
        dob: Date | null;
        email: string;
        first_name: String | null;
        last_name: String | null;
        password: string | null;
        phone: String | null;
        preferences: {
            launchpage: String | null;
        }
        registered: Boolean;
        role: String;
        schedule: Array<Object>;
        sms_consent: Boolean;
        refresh_token: string | null;
        token: String | null;
        user_id: String | null;
    }

    export interface Mail extends MailData{
        to: string;
        from: string;
        subject: string;
        html: string;
    }
}

export default App;