import * as AWS from "aws-sdk";
import * as dotenv from "dotenv";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { App } from "../../types/index";
import Employee from "../employee/employee.model";

// Put dotenv in use before importing controllers
dotenv.config();

// Declare model interface
interface IEmployeeDoc extends App.Employee, Document { }

export default class Token {
    public static async init() {
        try {
            // Configure AWS
            AWS.config.update({ region: "us-east-1" });

            const privKeyParams = {
                Bucket: "sst-p3",
                Key: "jwtRS256.key",
            };

            const pubKeyParams = {
                Bucket: "sst-p3",
                Key: "jwtRS256.key.pub",
            };

            const s3 = new AWS.S3();
            s3.getObject(privKeyParams, (err, data) => {
                if (err) {
                    throw Error;
                }

                this.privateKey = data.Body.toString();
            });

            s3.getObject(pubKeyParams, (err, data) => {
                if (err) {
                    throw Error;
                }

                this.publicKey = data.Body.toString();
            });

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public static sign(employee: IEmployeeDoc) {
        try {
            const token = jwt.sign(
                {
                    company: employee.company,
                    email: employee.email,
                    id: employee._id,
                    role: employee.role,
                },
                this.privateKey, { algorithm: "RS256" });

            return token;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public static authenticate(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const token = request.headers.authorization;

            jwt.verify(token, Token.publicKey, { algorithms: ["RS256"] }, (err, payload) => {
                if (err) {
                    console.log(err);
                    throw err;
                }

                request.token = payload;
                return next();
            });
        } catch (error) {
            return response.status(401).json("Access Denied!");
        }
    }

    public static async authorize(authCheck: string[], request: express.Request) {
        let validityCheck = false;

        while (validityCheck === false && authCheck.length !== 0) {
            const role: string = authCheck[0];
            authCheck.shift();

            switch (role) {
                case "employee":
                    if (request.token.id === request.params.id) {
                        validityCheck = true;
                    }
                    break;
                case "supervisor":
                    if (request.token.role === "owner" || request.token.role === "manager") {
                        const employee: IEmployeeDoc = await Employee.findOne({ _id: request.params.id });

                        if (employee.company === request.token.company) {
                            validityCheck = true;
                        }
                    }
                    break;
                case "customer":
                    if (request.token.company === request.params.id && (request.token.role === "owner" || request.token.role === "manager")) {
                        validityCheck = true;
                    }
                    break;
                case "owner":
                    if (request.token.role === "owner" && request.token.company === request.params.id) {
                        validityCheck = true;
                    }
                default:
                    break;
            }
        }

        return validityCheck;
    }

    private static privateKey: jwt.Secret;
    private static publicKey: jwt.GetPublicKeyOrSecret | string;
}
