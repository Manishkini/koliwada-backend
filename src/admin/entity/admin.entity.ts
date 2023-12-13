import mongoose from "mongoose";

export class AdminEntity {
    id?: mongoose.Schema.Types.ObjectId
    firstName: string;
    middleName: string;
    lastName: string;
    state: {
        id: mongoose.Schema.Types.ObjectId;
        name: string;
    }
    district: {
        id: mongoose.Schema.Types.ObjectId;
        name: string;
    }
    tehsil: {
        id: mongoose.Schema.Types.ObjectId;
        name: string;
    }
    village: {
        id: mongoose.Schema.Types.ObjectId;
        name: string;
    }
    role: {
        id: mongoose.Schema.Types.ObjectId;
        name: string;
        slug: string;
    }
    mobileNumber: string;
    email: string;
    password: string;
    createdBy: mongoose.Schema.Types.ObjectId;
    updatedBy: mongoose.Schema.Types.ObjectId;
    active: boolean;
}