import mongoose from "mongoose"

export interface AdminPayload {
    id?: mongoose.Schema.Types.ObjectId
    firstName: string
    middleName: string
    lastName: string
    role: string
    roleID?: mongoose.Schema.Types.ObjectId
    village: string
    villageID?: mongoose.Schema.Types.ObjectId
    mobileNumber: string
    email: string
    permissions: object[]
    accessTo?: string[]
}