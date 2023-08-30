/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ForbiddenException, Injectable } from '@nestjs/common'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@/config'
import { TokenPayloadDto } from './dto'
import { JwtPayload } from './validation'
import * as argon2 from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { SignInAuthDto } from './dto/sign-in.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(createAuthDto: CreateAuthDto): Promise<TokenPayloadDto> {
    try {
      const hash = await argon2.hash(createAuthDto.password)

      const { password, ...rest } = createAuthDto

      const userSaved = await this.db.user.create({
        data: {
          ...rest,
          hash,
        },
      })

      return this.signToken(userSaved.id, userSaved.email)
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ForbiddenException('Email already exists')
      }
      throw e
    }
  }

  async signIn(signInDto: SignInAuthDto): Promise<TokenPayloadDto> {
    const user = await this.db.user.findUnique({
      where: { email: signInDto.email },
    })

    if (!user) throw new ForbiddenException('Invalid credentials')

    const isValid = await argon2.verify(user.hash, signInDto.password)

    if (!isValid) throw new ForbiddenException('Invalid credentials')

    return this.signToken(user.id, user.email)
  }

  findAll() {
    return `This action returns all auth`
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`
  }

  remove(id: number) {
    return `This action removes a #${id} auth`
  }

  private async signToken(
    userId: string,
    email: string,
  ): Promise<TokenPayloadDto> {
    const data: Pick<JwtPayload, 'email' | 'sub'> = {
      email,
      sub: userId,
    }

    const accessToken = await this.jwt.signAsync(data, {
      secret: this.config.get('SECRET'),
      expiresIn: '30d',
    })

    return { accessToken }
  }
}
