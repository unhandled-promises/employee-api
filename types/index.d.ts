import { Schema } from "mongoose";

export declare module App {

    export interface Employee {
        company: Schema.Types.ObjectId;
        device: {
            manufacturer: string;
            type: string;
            consent: boolean;
        }
        dob: Date;
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        preferences: {
            launchpage: string;
        }
        role: string;
        sms_consent: boolean;
    }

}

export default App;