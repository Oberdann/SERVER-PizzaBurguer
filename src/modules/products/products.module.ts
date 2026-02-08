import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { Product, ProductsSchema } from 'src/database/products.schema';
import { ProductsController } from './products.controller';
import { ProductMapper } from './mappers/product.mapper';
import { ProductsService } from './products.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductsSchema }]),
    forwardRef(() => IngredientsModule),
  ],
  controllers: [ProductsController],
  providers: [
    {
      provide: 'IProductMapper',
      useClass: ProductMapper,
    },
    {
      provide: 'IProductsService',
      useClass: ProductsService,
    },
  ],
  exports: ['IProductsService'],
})
export class ProductsModule {}
