import { ConfigService as NestJSConfigService } from '@nestjs/config'
import { EnvironmentVariables } from './Env'

export class ConfigService extends NestJSConfigService<
  EnvironmentVariables,
  true
> {
  constructor() {
    super()
  }
}
