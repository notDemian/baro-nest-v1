import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'example@mail.com',
  })
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    type: String,
    example: '123456',
  })
  password: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User first name (Optional)',
    type: String,
    example: 'John',
  })
  firstName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User last name (Optional)',
    type: String,
    example: 'Doe',
  })
  lastName: string
}
