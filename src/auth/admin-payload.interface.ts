import { Role } from "src/schemas/role.schema"

export interface AdminPayload {
    firstName: string,
    middleName: string,
    lastName: string,
    role: Role,
    mobileNumber: string
    email: string
    permissions: string[],
}   