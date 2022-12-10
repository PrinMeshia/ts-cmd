import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
    (
        data: string | undefined,
        ctx: ExecutionContext,
    ) => {
        const request: Express.Request = ctx
            .switchToHttp()
            .getRequest();
        if(!request.user)
            null;
        if (data) {
            return (request.user as any)[data]
        }
        return request.user 
    },
);