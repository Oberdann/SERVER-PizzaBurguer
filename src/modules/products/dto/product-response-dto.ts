import { PriceMode } from 'src/common/enums/price-mode-enum';
import { ProductType } from 'src/common/enums/product-type-enum';
import { ProductCategory } from 'src/common/enums/product-category-enum';
import { IngredientPopulate } from 'src/modules/ingredients/dto/ingredient-populate';
import { ProductPriceDto } from './product-price-dto';

export interface ProductResponseDto {
  id: string;
  name: string;
  type: ProductType;
  category: ProductCategory;
  ingredients: IngredientPopulate[];
  priceMode: PriceMode;
  prices: ProductPriceDto[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
