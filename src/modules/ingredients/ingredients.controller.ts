import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { Ok } from 'src/common/utils/response.util';
import { IIngredientsService } from './contracts/ingredient.service-use-case';
import { IngredientCreateDto } from './dto/ingredient-create-dto';
import { IngredientUpdateNameDto } from './dto/ingredient-update-name-dto';
import { UpdateIngredientStatusDto } from './dto/ingredient-update-status-dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    @Inject('IIngredientsService')
    private readonly ingredientsService: IIngredientsService,
  ) {}

  @HttpCode(200)
  @Get()
  async getAll() {
    const response = await this.ingredientsService.getAll();

    return Ok('Ingredientes encontrados com sucesso', response);
  }

  @HttpCode(200)
  @Get(':id')
  async getById(@Param('id') id: string) {
    const response = await this.ingredientsService.getById(id);

    return Ok('Ingriente encontrado com sucesso.', response);
  }

  @HttpCode(201)
  @Post()
  async create(@Body() ingredient: IngredientCreateDto) {
    const ingredientResponse = await this.ingredientsService.create(ingredient);

    return Ok('Ingrediente criado com sucesso.', ingredientResponse);
  }

  @HttpCode(200)
  @Put(':id/name')
  async updateName(
    @Param('id') id: string,
    @Body() dto: IngredientUpdateNameDto,
  ) {
    const ingredientResponse = await this.ingredientsService.updateName(
      id,
      dto.name,
    );

    return Ok(
      'Nome do ingrediente atualizado com sucesso.',
      ingredientResponse,
    );
  }

  @HttpCode(200)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() ingredient: UpdateIngredientStatusDto,
  ) {
    const ingredientResponse = await this.ingredientsService.updateStatus(
      id,
      ingredient.isActive,
    );

    return Ok(
      `Status do ingrediente atualizado para ${ingredient.isActive ? '"ativo"' : '"inativo"'} com sucesso`,
      ingredientResponse,
    );
  }

  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.ingredientsService.delete(id);

    return Ok('Ingrediente deletado com sucesso.');
  }
}
