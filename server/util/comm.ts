import * as sendGrid from "@sendgrid/mail";
import * as dotenv from "dotenv";
import { App } from "../../types/index";

// Put dotenv in use before importing controllers
dotenv.config();

// Nodejs encryption with CTR
const sendGridKey = process.env.SENDGRID_KEY;

export default class Comm {
    public static sendEmail = (email: App.Mail) => {
        sendGrid.setApiKey(sendGridKey);
        sendGrid.send(email);
    }
}
