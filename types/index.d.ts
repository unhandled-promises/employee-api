import { Schema } from "mongoose";
import { MailData } from '@sendgrid/helpers/classes/mail';

export declare module App {
    export interface Employee {
        company: Schema.Types.ObjectId;
        device: {
            consent: Boolean | null;
            manufacturer: String | null;
            type: String | null;
        }
        dob: Date | null;
        email: string;
        first_name: String | null;
        last_name: String | null;
        password: String | null;
        phone: String | null;
        preferences: {
            launchpage: String | null;
        }
        registered: Boolean;
        role: String;
        schedule: Array<Object>;
        sms_consent: Boolean;
        token: String | null;
    }

    export interface Mail extends MailData{
        to: string;
        from: string;
        subject: string;
        html: string;
    }
}

export default App;