import { Schema } from "mongoose";
import { MailData } from '@sendgrid/helpers/classes/mail';

export declare module App {
    export interface Employee {
        access_token: string | null;
        avatar: string | null,
        company: Schema.Types.ObjectId;
        devices: Array<Device>;
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
        user_id: string | null;
    }

    export interface Mail extends MailData{
        to: string;
        from: string;
        templateId: string;
        dynamic_template_data: object;
    }

    export interface Device {
        battery: String | null;
        id: String | null;
        last_sync_time: Date | null;
        type: String | null;
        version: String | null;
    }
}

export default App;