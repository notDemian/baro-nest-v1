import { plainToClass } from 'class-transformer'
import { IsEmail, IsNumber, IsString, validateSync } from 'class-validator'
export class JwtPayload {
  @IsString()
  sub: string

  @IsEmail()
  email: string

  @IsNumber()
  iat: number

  @IsNumber()
  exp: number
}

export function validateJwtPayload(payload: unknown): JwtPayload {
  const finalConfig = plainToClass(JwtPayload, payload, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(finalConfig, { skipMissingProperties: true })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return finalConfig
}
