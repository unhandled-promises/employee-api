import { Document, model, Schema } from "mongoose";
import { SchemaDef } from "../../types";
import { App } from "../../types/index";

// Declare model interface
interface IEmployeeDoc extends App.Employee, Document { }

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
    password: {
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
    registered: {
        type: Boolean,
    },
    role: {
        required: true,
        type: String,
    },
    schedule: [
        {
            end: {
                default: null,
                type: String || null,
            },
            start: {
                default: null,
                type: String || null,
            },
            working: {
                default: false,
                type: Boolean,
            },
        },
    ],
    sms_consent: {
        type: Boolean,
    },
    token: {
        type: String,
    },
};

// Define model schema
const employeeSchema = new Schema(employeeSchemaDef, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default model<IEmployeeDoc>("Employee", employeeSchema);