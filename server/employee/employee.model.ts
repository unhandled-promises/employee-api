import { Document, model, Schema } from "mongoose";
import { SchemaDef } from "../../types";
import { App } from "../../types/index";

// Declare model interface
interface IEmployeeDoc extends App.Employee, Document {}

const employeeSchemaDef: SchemaDef<App.Employee> = {
    company: {
        type: Schema.Types.ObjectId,
    },
    device: {
        consent: {
            type: Boolean,
        },
        manufacturer: {
            type: String,
        },
        type: {
            type: String,
        },
    },
    dob: {
        required: true,
        type: Date,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    first_name: {
        required: true,
        type: String,
    },
    last_name: {
        type: String,
    },
    phone: {
        type: String,
    },
    preferences: {
        launchpage: {
            type: String,
        },
    },
    role: {
        type: String,
    },
    sms_consent: {
        type: Boolean,
    },
};

// Define model schema
const employeeSchema = new Schema(employeeSchemaDef, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default model<IEmployeeDoc>("Employee", employeeSchema);
