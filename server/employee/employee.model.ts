import { Document, model, Schema } from "mongoose";
import { SchemaDef } from "../../types";
import { App } from "../../types/index";

// Declare model interface
interface IEmployeeDoc extends App.Employee, Document { }

const employeeSchemaDef: SchemaDef<App.Employee> = {
    access_token: {
        default: null,
        type: String || null,
    },
    avatar: {
        default: null,
        type: String || null,
    },
    company: {
        required: true,
        type: Schema.Types.ObjectId,
    },
    devices: [
        {
            battery: {
                default: null,
                type: String || null,
            },
            id: {
                default: null,
                type: String || null,
            },
            last_sync_time: {
                default: null,
                type: Date || null,
            },
            type: {
                default: null,
                type: String || null,
            },
            version: {
                default: null,
                type: String || null,
            },
        },
    ],
    dob: {
        default: null,
        type: Date || null,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    first_name: {
        default: null,
        type: String || null,
    },
    last_name: {
        default: null,
        type: String || null,
    },
    password: {
        default: null,
        type: String || null,
    },
    phone: {
        default: null,
        type: String || null,
    },
    preferences: {
        launchpage: {
            default: "dashboard",
            type: String,
        },
    },
    refresh_token: {
        default: null,
        type: String || null,
    },
    registered: {
        default: false,
        type: Boolean,
    },
    role: {
        default: "employee",
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
        default: false,
        type: Boolean,
    },
    token: {
        default: null,
        type: String || null,
    },
    user_id: {
        default: null,
        type: String || null,
    },
};

// Define model schema
const employeeSchema = new Schema(employeeSchemaDef, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

export default model<IEmployeeDoc>("Employee", employeeSchema);
