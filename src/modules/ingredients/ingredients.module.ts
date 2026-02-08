import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { Ingredient } from 'src/database/ingredients.schema';
import { IngredientsSchema } from '../../database/ingredients.schema';
import { IngredientMapper } from './mappers/ingredients.mapper';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ingredient.name, schema: IngredientsSchema },
    ]),
    forwardRef(() => ProductsModule),
  ],
  controllers: [IngredientsController],
  providers: [
    {
      provide: 'IIngredientMapper',
      useClass: IngredientMapper,
    },
    {
      provide: 'IIngredientsService',
      useClass: IngredientsService,
    },
  ],
  exports: ['IIngredientsService'],
})
export class IngredientsModule {}
