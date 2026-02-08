import { Injectable } from '@nestjs/common';
import { IngredientDocument } from 'src/database/ingredients.schema';
import { IIngredientMapper } from '../contracts/ingredient-mapper-interface';
import { IngredientResponseDto } from '../dto/ingredient-response-dto';

@Injectable()
export class IngredientMapper implements IIngredientMapper {
  toResponse(doc: IngredientDocument): IngredientResponseDto {
    return {
      id: doc.id,
      name: doc.name,
      isActive: doc.isActive,
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString(),
    };
  }

  toResponseList(docs: IngredientDocument[]): IngredientResponseDto[] {
    return docs.map((doc) => this.toResponse(doc));
  }
}
