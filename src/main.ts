import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionGlobalFilter } from './common/filters/exception-global-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new ExceptionGlobalFilter());

  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   methods: 'GET,POST,PUT,DELETE',
  //   credentials: true,
  // });

  const config = new DocumentBuilder()
    .setTitle('Servidor - Pizza Burguer')
    .setDescription('Software para retirada de pedidos da pizzaria')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  // await app.listen(process.env.PORT ?? 8080);
  await app.init();
}

void bootstrap();
