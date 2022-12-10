import { UserEntity } from '@app/user/entities/user.entity'
import { UserService } from '@app/user/user.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import {
    ExtractJwt,
    Strategy,
} from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt',
) {
    constructor(
        private readonly userService: UserService,
        config: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }

    async validate(payload: {
        userId: string,
        username: string,
        email: string
    }): Promise<UserEntity> {
        return await this.userService.findOne(payload.userId)
    }
}