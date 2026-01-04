import { IngredientCreateDto } from '../dto/ingredients-create';
import { IngredientResponseDto } from '../dto/ingredients-response';

export interface IIngredientsService {
  createIngredient(
    ingredientDto: IngredientCreateDto,
  ): Promise<IngredientResponseDto>;

  getAllIngredients(): Promise<IngredientResponseDto[]>;
}
