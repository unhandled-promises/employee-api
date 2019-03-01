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
        console.log("Sign");
        console.log(privateKey);
        console.log(publicKey);
        console.log(employee);
        const token = jwt.sign(
            {
                _id: employee._id,
                company: employee.company,
                email: employee.email,
                role: employee.role,
            },
            privateKey, { algorithm: "RS256" });

        console.log(token);
        console.log("Past Token");

        return token;
    }

    public static authenticate = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const token = request.headers.authorization;

            jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, payload) => {
                if (err) {
                    throw err;
                }
                return next();
            });
        } catch (error) {
            return response.status(401).send("Authentication Failed!");
        }
    }

    public static authorization = () => {
        return "hi";
    }
}
