import { ProductNoIngredientsIdDto } from '../dto/product-no-ingredients-id-dto';
import { ProductResponseDto } from '../dto/product-response-dto';
import { ProductCreateDto } from '../dto/product-create-dto';
import { ProductDocument } from 'src/database/products.schema';

export interface IProductMapper {
  toResponseNoIngredientId(doc: ProductDocument): ProductNoIngredientsIdDto;
  toResponseIngredientPopulate(doc: ProductDocument): ProductResponseDto;
  toResponseIngredientPopulateList(
    docs: ProductDocument[],
  ): ProductResponseDto[];
  toDocument(dto: ProductCreateDto): Partial<ProductDocument>;
}
