import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestJSConfigModule } from '@nestjs/config'
import { ConfigService } from './Config.service'
import { validate } from './Env'

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
  imports: [
    NestJSConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
})
export class ConfigModule {}
