import { IngredientDocument } from 'src/database/ingredients.schema';
import { IngredientResponseDto } from '../dto/ingredient-response-dto';

export interface IIngredientMapper {
  toResponse(doc: IngredientDocument): IngredientResponseDto;
  toResponseList(docs: IngredientDocument[]): IngredientResponseDto[];
}
