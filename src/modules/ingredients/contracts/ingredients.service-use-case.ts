import { IngredientCreateDto } from '../dto/ingredients-create';
import { IngredientResponseDto } from '../dto/ingredients-response';

export interface IIngredientsService {
  createIngredients(
    ingredientDto: IngredientCreateDto,
  ): Promise<IngredientResponseDto>;

  findAllIngredients(): Promise<IngredientResponseDto[]>;
}
