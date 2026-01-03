import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientCreateDto } from './dto/ingredients-create';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    @Inject('IIngredientsService')
    private readonly ingredientsService: IngredientsService,
  ) {}

  @HttpCode(201)
  @Post()
  async createIngredients(@Body() ingredient: IngredientCreateDto) {
    const ingredientResponse =
      await this.ingredientsService.createIngredients(ingredient);

    return {
      message: 'Ingrediente criado com sucesso',
      data: ingredientResponse,
    };
  }

  @HttpCode(200)
  @Get('allIngredients')
  async findAll() {
    return await this.ingredientsService.findAllIngredients();
  }
}
