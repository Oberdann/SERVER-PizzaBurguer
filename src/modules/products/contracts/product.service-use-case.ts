import { ProductCategory } from 'src/common/enums/product-category-enum';
import { ProductNoIngredientsIdDto } from '../dto/product-no-ingredients-id-dto';
import { ProductResponseDto } from '../dto/product-response-dto';
import { ProductCreateDto } from '../dto/product-create-dto';

export interface IProductsService {
  getAll(filters?: {
    isActive?: boolean;
    category?: ProductCategory;
  }): Promise<ProductResponseDto[]>;

  getById(id: string): Promise<ProductResponseDto>;

  create(productDto: ProductCreateDto): Promise<ProductResponseDto>;

  updateName(id: string, name: string): Promise<ProductNoIngredientsIdDto>;

  updateStatus(
    id: string,
    isActive: boolean,
  ): Promise<ProductNoIngredientsIdDto>;

  addIngredients(
    id: string,
    ingredientIds: string[],
  ): Promise<ProductResponseDto>;

  removeIngredients(
    id: string,
    ingredientIds: string[],
  ): Promise<ProductResponseDto>;

  delete(id: string): Promise<void>;

  removeIngredientFromAllProducts(ingredientId: string): Promise<void>;
}
