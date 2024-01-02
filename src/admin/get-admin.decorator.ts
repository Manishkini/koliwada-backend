import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AdminPayload } from "./admin-payload.interface";

const ROLES = ['super_admin', 'admin', 'chairman', 'vice_president', 'secretary', 'deputy_secretary', 'treasurer', 'deputy_treasurer']

const findAccessTo = (role: string): string[] => {
    const findIndexOfRole = ROLES.findIndex((r) => r === role);
    const accessTo = [];
    if (findIndexOfRole > -1) {
        for (let i = findIndexOfRole; i < ROLES.length; i++) {
            accessTo.push(ROLES[i])
        }
    }
    return accessTo;
}

const getAccessTo = (role: string): string[] => {
    return findAccessTo(role)
}

export const GetAdmin = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AdminPayload => {
        const request = ctx.switchToHttp().getRequest();
        request.user['accessTo'] = getAccessTo(request.user.role);
        return request.user;
    },
);