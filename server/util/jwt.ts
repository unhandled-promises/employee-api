import * as dotenv from "dotenv";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { App } from "../../types/index";

// Put dotenv in use before importing controllers
dotenv.config();

// Nodejs encryption with CTR
const privateKey = process.env.privateKey;
const publicKey = process.env.publicKey;

// Declare model interface
interface IEmployeeDoc extends App.Employee, Document { }

export default class Token {
    public static sign = (employee: IEmployeeDoc) => {
        const token = jwt.sign(
            { _id: employee._id, email: employee.email, role: employee.role, company: employee.company },
            privateKey, { algorithm: "RS256" });
        return token;
    }

    public static authenticate = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const token = request.headers.authorization;

        jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, payload) => {
            if (err) { console.log(err); }
            return next();
        });

        return false;
    }
}
