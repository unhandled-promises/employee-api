import * as crypto from "crypto";
import * as dotenv from "dotenv";

// Put dotenv in use before importing controllers
dotenv.config();

// Nodejs encryption with CTR
const algorithm = process.env.PW_ALG;
const secret = process.env.PW_SEC;

export default class Encryption {
    public static encrypt = (value: string) => {
        const cipher = crypto.createCipher(algorithm, secret);
        let crypted = cipher.update(value, "utf8", "hex");
        crypted += cipher.final("hex");

        return crypted;
    }

    public static decrypt = (value: string) => {
        const decipher = crypto.createDecipher(algorithm, secret);
        let decrypted = decipher.update(value, "hex", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    }

    public static createVerificationCode = () => {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
        const stringLength = 8;
        let verificationCode = "";
        for (let i = 0; i < stringLength; i++) {
            const rnum = Math.floor(Math.random() * chars.length);
            verificationCode += chars.substring(rnum, rnum + 1);
        }

        return verificationCode;
    }
}
