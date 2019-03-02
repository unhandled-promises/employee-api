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

        // const msg = {
        //     to: email.to,
        //     from: email.from,
        //     subject: email.subject,
        //     html: email.msg,
        //   };

        console.log(email);

        sendGrid.send(email);
    }
}
