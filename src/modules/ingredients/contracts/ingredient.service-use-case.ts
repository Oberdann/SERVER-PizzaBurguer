import { IngredientCreateDto } from '../dto/ingredient-create-dto';
import { IngredientResponseDto } from '../dto/ingredient-response-dto';

export interface IIngredientsService {
  getAll(): Promise<IngredientResponseDto[]>;

  getById(id: string): Promise<IngredientResponseDto>;

  create(ingredientDto: IngredientCreateDto): Promise<IngredientResponseDto>;

  updateName(id: string, name: string): Promise<IngredientResponseDto>;

  updateStatus(id: string, status: boolean): Promise<IngredientResponseDto>;

  delete(id: string): Promise<void>;
}
