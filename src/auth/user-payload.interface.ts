import { Role } from "src/schemas/role.schema"

export interface UserPayload {
    firstName: string,
    middleName: string,
    lastName: string,
    role: Role,
    mobileNumber: string
    email: string
    permissions: string[],
}