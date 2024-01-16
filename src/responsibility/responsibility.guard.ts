import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ResponsibilityGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const responsibility = this.reflector.getAllAndMerge<string[]>('responsibility', [context.getHandler(), context.getClass()]);

        if (!responsibility) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return this.matchRoles(responsibility, user.role);
    }

    matchRoles(responsibility: string[], userRole: string): boolean {
        if (responsibility.includes(userRole)) {
            return true
        }
        return false;
    }
}