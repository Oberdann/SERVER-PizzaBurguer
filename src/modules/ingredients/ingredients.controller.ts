import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientCreateDto } from './dto/ingredients-create';
import { Ok } from 'src/common/utils/response.util';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    @Inject('IIngredientsService')
    private readonly ingredientsService: IngredientsService,
  ) {}

  @HttpCode(201)
  @Post()
  async createIngredient(@Body() ingredient: IngredientCreateDto) {
    const ingredientResponse =
      await this.ingredientsService.createIngredient(ingredient);

    return Ok('Ingrediente criado com sucesso', ingredientResponse);
  }

  @HttpCode(200)
  @Get('allIngredients')
  async getAll() {
    const ingredientsReponse =
      await this.ingredientsService.getAllIngredients();

    return Ok('Ingredientes encontrados com sucesso', ingredientsReponse);
  }
}
