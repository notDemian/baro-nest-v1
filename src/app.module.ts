import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from './config'

@Module({
  imports: [ConfigModule, AuthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
