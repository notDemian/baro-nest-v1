import { ConfigService } from '@/config'
import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(readonly env: ConfigService) {
    super({
      datasources: {
        db: {
          url: env.get('DATABASE_URL'),
        },
      },
    })
  }
  cleanDB(): void {
    this.$transaction([this.user.deleteMany()])
  }
}
