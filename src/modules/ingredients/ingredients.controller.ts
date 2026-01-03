import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @HttpCode(201)
  @Post('teste')
  async createIngredients() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.ingredientsService.createTest();
  }

  @HttpCode(200)
  @Get('allIngredients')
  async findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.ingredientsService.findAll();
  }
}
