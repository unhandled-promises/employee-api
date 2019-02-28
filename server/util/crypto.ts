import * as crypto from "crypto";
import * as dotenv from "dotenv";

// Put dotenv in use before importing controllers
dotenv.config();

// Nodejs encryption with CTR
const algorithm = process.env.pwAlgorithm;
const secret = process.env.pwSecret;

export default class Encryption {
    public static encrypt = (value: string) => {
        const cipher = crypto.createCipher(algorithm, secret)
        let crypted = cipher.update(value,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    public static decrypt = (value: string) => {
        const decipher = crypto.createDecipher(algorithm, secret)
        let decrypted = decipher.update(value,'hex','utf8')
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}