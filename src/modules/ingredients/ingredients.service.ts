import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Ingredient,
  IngredientDocument,
} from 'src/database/ingredients.schema';
import { IIngredientsService } from './contracts/ingredients.service-use-case';
import { IngredientCreateDto } from './dto/ingredients-create';
import { IngredientResponseDto } from './dto/ingredients-response';

@Injectable()
export class IngredientsService implements IIngredientsService {
  constructor(
    @InjectModel(Ingredient.name)
    private readonly ingredientModel: Model<IngredientDocument>,
  ) {}

  async createIngredients(
    ingredientDto: IngredientCreateDto,
  ): Promise<IngredientResponseDto> {
    const ingredientEntity = await this.ingredientModel.create(ingredientDto);

    return this.toResponse(ingredientEntity);
  }

  async findAllIngredients(): Promise<IngredientResponseDto[]> {
    return this.ingredientModel.find();
  }

  private toResponse(doc: IngredientDocument): IngredientResponseDto {
    return {
      id: doc.id,
      name: doc.name,
      isActive: doc.isActive,
      createdAt: doc.createdAt.toString(),
      updatedAt: doc.updatedAt.toString(),
    };
  }
}
