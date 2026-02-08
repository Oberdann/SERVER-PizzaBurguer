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
  Query,
} from '@nestjs/common';
import { Ok } from 'src/common/utils/response.util';
import { ApiQuery } from '@nestjs/swagger';
import { IProductsService } from './contracts/product.service-use-case';
import { ProductCategory } from 'src/common/enums/product-category-enum';
import { ProductCreateDto } from './dto/product-create-dto';
import { ProductUpdateNameDto } from './dto/product-update-name-dto';
import { ProductUpdateStatusDto } from './dto/product-update-status-dto';
import { ProductUpdateIngredientsDto } from './dto/product-update-ingredients-dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('IProductsService')
    private readonly productsService: IProductsService,
  ) {}

  @HttpCode(200)
  @Get()
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'category', required: false, enum: ProductCategory })
  async getAll(
    @Query('isActive') isActive?: boolean,
    @Query('category') category?: ProductCategory,
  ) {
    const response = await this.productsService.getAll({ isActive, category });
    const filters: string[] = [];

    if (isActive !== undefined) {
      filters.push(`status ${isActive ? 'ativo' : 'inativo'}`);
    }

    if (category) {
      filters.push(`categoria ${category}`);
    }

    const message = `Productos encontrados com sucesso${
      filters.length ? ` com filtros: ${filters.join(', ')}` : ''
    }.`;

    return Ok(message, response);
  }

  @HttpCode(200)
  @Get(':id')
  async getById(@Param('id') id: string) {
    const response = await this.productsService.getById(id);

    return Ok('Produto encontrado com sucesso.', response);
  }

  @HttpCode(201)
  @Post()
  async create(@Body() produto: ProductCreateDto) {
    const response = await this.productsService.create(produto);

    return Ok('Produto criada com sucesso.', response);
  }

  @HttpCode(200)
  @Put(':id')
  async updateName(
    @Param('id') id: string,
    @Body() produto: ProductUpdateNameDto,
  ) {
    const response = await this.productsService.updateName(id, produto.name);

    return Ok('Nome do produto atualizado com sucesso.', response);
  }

  @HttpCode(200)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() produto: ProductUpdateStatusDto,
  ) {
    const response = await this.productsService.updateStatus(
      id,
      produto.isActive,
    );

    return Ok(
      `Status do produto atualizado para ${produto.isActive ? '"ativo"' : '"inativo"'} com sucesso.`,
      response,
    );
  }

  @HttpCode(200)
  @Put(':id/ingredients/add')
  async addIngredients(
    @Param('id') id: string,
    @Body() produto: ProductUpdateIngredientsDto,
  ) {
    const response = await this.productsService.addIngredients(
      id,
      produto.ingredientsId,
    );

    return Ok('Ingredientes adicionados ao produto com sucesso.', response);
  }

  @HttpCode(200)
  @Put(':id/ingredients/remove')
  async removeIngredients(
    @Param('id') id: string,
    @Body() produto: ProductUpdateIngredientsDto,
  ) {
    const response = await this.productsService.removeIngredients(
      id,
      produto.ingredientsId,
    );

    return Ok('Ingredientes removidos do produto com sucesso.', response);
  }

  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.productsService.delete(id);

    return Ok('Produto deletada com sucesso');
  }
}
