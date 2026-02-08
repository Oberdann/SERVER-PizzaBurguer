import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Ingredient,
  IngredientDocument,
} from 'src/database/ingredients.schema';

import { IIngredientMapper } from './contracts/ingredient-mapper-interface';
import { IngredientNotFoundException } from './exceptions/exception-ingredient-not-found';
import { IngredientStatusAlreadySetException } from './exceptions/exception-ingredient-status-already';
import { IngredientResponseDto } from './dto/ingredient-response-dto';
import { IIngredientsService } from './contracts/ingredient.service-use-case';
import { IngredientCreateDto } from './dto/ingredient-create-dto';
import { IProductsService } from '../products/contracts/product.service-use-case';

@Injectable()
export class IngredientsService implements IIngredientsService {
  constructor(
    @InjectModel(Ingredient.name)
    private readonly ingredientModel: Model<IngredientDocument>,

    @Inject('IIngredientMapper')
    private readonly mapper: IIngredientMapper,

    @Inject(forwardRef(() => 'IProductsService'))
    private readonly productService: IProductsService,
  ) {}

  async getAll(): Promise<IngredientResponseDto[]> {
    const ingredientList = await this.ingredientModel.find();

    const response = this.mapper.toResponseList(ingredientList);

    return response;
  }

  async getById(id: string): Promise<IngredientResponseDto> {
    const ingredient = await this.findByIdOrFail(id);

    const response = this.mapper.toResponse(ingredient);

    return response;
  }

  async create(
    ingredientDto: IngredientCreateDto,
  ): Promise<IngredientResponseDto> {
    const ingredientEntity = await this.ingredientModel.create(ingredientDto);

    const response = this.mapper.toResponse(ingredientEntity);

    return response;
  }

  async updateName(id: string, name: string): Promise<IngredientResponseDto> {
    const ingredient = await this.findByIdOrFail(id);

    ingredient.name = name;

    await ingredient.save();

    const response = this.mapper.toResponse(ingredient);
    return response;
  }

  async updateStatus(
    id: string,
    status: boolean,
  ): Promise<IngredientResponseDto> {
    const ingredient = await this.findByIdOrFail(id);

    if (ingredient.isActive === status) {
      throw new IngredientStatusAlreadySetException(
        `O ingrediente com ID ${id} ja está ${status ? 'ativo' : 'inativo'}.`,
      );
    }

    ingredient.isActive = status;

    await ingredient.save();

    const response = this.mapper.toResponse(ingredient);

    return response;
  }

  async delete(id: string): Promise<void> {
    await this.findByIdOrFail(id);

    await this.productService.removeIngredientFromAllProducts(id);

    await this.ingredientModel.deleteOne({ _id: id });
  }

  private async findByIdOrFail(id: string) {
    const ingredientEntity = await this.ingredientModel.findById(id);

    if (!ingredientEntity) {
      throw new IngredientNotFoundException(
        `O ingrediente com ID ${id} não foi encontrado.`,
        404,
      );
    }

    return ingredientEntity;
  }
}
