import mongoose from "mongoose";

export class UserEntity {
    id?: mongoose.Schema.Types.ObjectId
    firstName: string;
    middleName: string;
    lastName: string;
    firstNameNative: string;
    middleNameNative: string;
    lastNameNative: string;
    village: {
        id: mongoose.Schema.Types.ObjectId;
        name: string;
    }
    mobileNumber: string;
    email: string;
    password: string;
    createdBy: mongoose.Schema.Types.ObjectId;
    updatedBy: mongoose.Schema.Types.ObjectId;
    active: boolean;
}