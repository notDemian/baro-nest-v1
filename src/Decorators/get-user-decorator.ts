import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { Request } from 'express'
// import { validateUserPayload } from '@/user/validation/user.validation'

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()

    if (data) {
      try {
        const rUser = request.user ?? {}

        return (rUser as User)[data]
      } catch (e) {
        throw new UnauthorizedException('Usuario invalido')
      }
    }

    return request.user
  },
)
