import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUserPayload {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
}

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUserPayload;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
