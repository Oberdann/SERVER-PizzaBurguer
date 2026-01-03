import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Ingredient,
  IngredientDocument,
} from 'src/database/ingredients.schema';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(Ingredient.name)
    private ingredientModel: Model<IngredientDocument>,
  ) {}

  async createTest() {
    return this.ingredientModel.create({
      name: 'Queijo',
      isActive: true,
    });
  }

  async findAll() {
    return this.ingredientModel.find();
  }
}
