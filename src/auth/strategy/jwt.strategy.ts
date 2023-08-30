import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { validateJwtPayload } from '../validation'
import { PrismaService } from '../../prisma/prisma.service'
import { User } from '@prisma/client'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly db: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET'),
    })
  }

  async validate(payload: unknown): Promise<User | null> {
    try {
      const jwtPayload = validateJwtPayload(payload)

      const user = await this.db.user.findUnique({
        where: {
          id: jwtPayload.sub,
        },
      })

      if (!user) throw new Error('User not found')
      return user
    } catch (e) {
      if (e instanceof Error) console.log(e.message)
      throw new UnauthorizedException('Invalid token')
    }
  }
}
