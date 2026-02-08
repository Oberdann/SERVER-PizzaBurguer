import { ProductCategory } from 'src/common/enums/product-category-enum';

export interface ProductNoIngredientsIdDto {
  id: string;
  name: string;
  category: ProductCategory;
  isActive?: boolean;
}
