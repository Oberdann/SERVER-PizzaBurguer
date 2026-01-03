import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsModule } from './modules/ingredients/ingredientes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL ?? ''),
    IngredientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
