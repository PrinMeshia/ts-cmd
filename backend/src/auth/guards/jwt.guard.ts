import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') { }

export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context) {
        return user;
    }
}