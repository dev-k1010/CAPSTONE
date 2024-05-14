import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaClient } from "@prisma/client";

import jwt from 'jsonwebtoken';


@Injectable()
export class config {
    constructor(
        private jwtService: JwtService,
        // private readonly prisma: PrismaClient
    ) { }
    prisma = new PrismaClient()

    // Check Email
    checkMail(email: string) {
        let data = this.prisma.users.findFirstOrThrow(
            {
                where: { user_email: email }
            }
        )
        return data
    }

    // Create Token
    createToken(data: any) {
        let token = this.jwtService.signAsync({ data }, { secret: "BI_MAT", expiresIn: "1d" })

        return token
    }

    // Check Token ( expired, incorrect sercurity key, incorrect format)
    async checkToken(token: any) {
        await jwt.verify(token, "BI_MAT", error => error)
    }

    // Create Token Refresh
    async createTokenRef(data: any) {

        let tokenRef = await this.jwtService.sign({ data }, { secret: "BI_MAT", expiresIn: "30d" })

        return tokenRef
    }




}