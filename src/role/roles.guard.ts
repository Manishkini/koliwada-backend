import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndMerge<string[]>('roles', [context.getHandler(), context.getClass()]);

        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return this.matchRoles(roles, user.role);
    }

    matchRoles(roles: string[], userRole: string): boolean {
        if (roles.includes(userRole)) {
            return true
        }
        return false;
    }
}