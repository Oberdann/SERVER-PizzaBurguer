import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionGlobalFilter } from './common/filters/exception-global-filter';
import { ObjectIdParamPipe } from './common/filters/objectId-validation-pipe';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';

const expressApp = express();

let server: any;

async function bootstrapNest() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.setGlobalPrefix('v1'); // só "v1", a Vercel já adiciona /api

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new ExceptionGlobalFilter());
  app.useGlobalPipes(new ObjectIdParamPipe());

  // Swagger
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

  await app.init();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return serverlessExpress({ app: expressApp });
}

// Export único que a Vercel vai chamar
export const handler = async (event: any, context: any) => {
  if (!server) {
    server = await bootstrapNest();
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return server(event, context);
};
