import { NestMiddleware } from "@nestjs/common";

export class AuthMiddleware implements NestMiddleware {
    async use(req: any, res: any, next: (error?: any) => void) {
        if(!req.headers.authorization){
            req.user = null
            next()
            return;
        }
        next()
    }

}