import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { App } from "../../types/index";
import { Document } from "mongoose";
import Employee from "../employee/employee.model";

// Put dotenv in use before importing controllers
dotenv.config();

// Nodejs encryption with CTR
const privateKey = process.env.privateKey;
const publicKey = process.env.publicKey;

// Declare model interface
interface IEmployeeDoc extends App.Employee, Document { }

export default class Token {
    public static sign = (employee: IEmployeeDoc) => {
        console.log(employee);

        const token = jwt.sign({ _id: employee._id,  email: employee.email, role: employee.role}, privateKey, { algorithm: "RS256"});
        console.log("Token");
        console.log(token);

        return token;
    }

    public static authorize = () => {

    }
}