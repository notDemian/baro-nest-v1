import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from './config'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  const PORT = parseInt(configService.get('PORT'))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  // global prefix /api
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Baro API Docs')
    .setDescription(
      'Check out the Baro API docs <a href="https://baro.up.railway.app/">Baro Site</a>',
    )
    .setVersion('1.0')
    // .addTag('NestJS')
    // .addTag('Baro')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(PORT)
  console.log(`Server running on http://localhost:${PORT}`)
}
bootstrap()
