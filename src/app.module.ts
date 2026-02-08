import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsModule } from './modules/ingredients/ingredients.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL ?? ''),
    IngredientsModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
