import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JwtStrategy extends
PassportStrategy(Strategy,"khoa_token") {
 
       constructor(config: ConfigService) {
            super({
                jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey:"BI_MAT",
        });
 }



        async validate(payload: any) {
            return payload;
}
}
