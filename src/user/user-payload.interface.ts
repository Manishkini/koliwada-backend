import mongoose from "mongoose"
export interface UserPayload {
    id?: mongoose.Schema.Types.ObjectId
    firstName: string
    middleName: string
    lastName: string
    village: string
    villageID?: mongoose.Schema.Types.ObjectId
    mobileNumber: string
    email: string
}