import * as dotenv from "dotenv";
import * as express from "express";

// Put dotenv in use before importing controllers
dotenv.config();

// Import controllers
import employeeController from "./employee/employee.controller";

// Create the express application
const app = express();

// Assign controllers to routes
app.use("/api/employee", employeeController);

export default app;
