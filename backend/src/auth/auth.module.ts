import { UserModule } from '@app/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies';

@Module({
    imports: [JwtModule.register({}),UserModule],
    providers: [JwtStrategy],
})
export class AuthModule { }
