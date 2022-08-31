import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder()
    .setTitle('JWT Authication')
    .setDescription('Документация REST API')
    .setVersion('1.0.0')
    .addTag('ARAOvsepyan <ara07.99@icloud.com>')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'token' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api/docs`,
      );
      console.log(`Press CTRL + C to stop server`);
    }
  });
}

bootstrap();
