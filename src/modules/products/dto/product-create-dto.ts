import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductPriceDto } from './product-price-dto';
import { ProductType } from 'src/common/enums/product-type-enum';
import { PriceMode } from 'src/common/enums/price-mode-enum';
import { ProductCategory } from 'src/common/enums/product-category-enum';

export class ProductCreateDto {
  @ApiProperty({
    example: 'Margherita',
    description: 'Nome do produto',
  })
  @IsString({ message: 'O campo [name] precisa ser uma string.' })
  @IsNotEmpty({ message: 'O campo [name] não pode estar vazio.' })
  name: string;

  @ApiProperty({
    example: ProductType.PIZZA,
    description: 'Tipo do item',
    enum: ProductType,
  })
  @IsEnum(ProductType, {
    message: 'O campo [type] precisa ser um valor válido.',
  })
  type: ProductType;

  @ApiProperty({
    example: ProductCategory.PIZZA_SALGADA,
    description: 'Categoria do item',
    enum: ProductCategory,
  })
  @IsEnum(ProductCategory, {
    message: 'O campo [category] precisa ser um valor válido.',
  })
  category: ProductCategory;

  @ApiPropertyOptional({
    example: ['ingredienteId1', 'ingredienteId2'],
    description: 'IDs dos ingredientes',
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'O campo [ingredients] precisa ser um array.' })
  @ArrayNotEmpty({ message: 'O campo [ingredients] não pode estar vazio.' })
  @IsString({
    each: true,
    message: 'Todos os itens do campo [ingredients] precisam ser strings.',
  })
  ingredients: string[];

  @ApiProperty({
    example: PriceMode.SLICE,
    description: 'Modo de precificação',
    enum: PriceMode,
  })
  @IsEnum(PriceMode, {
    message: 'O campo [priceMode] precisa ser um valor válido.',
  })
  priceMode: PriceMode;

  @ApiProperty({
    description: 'Opções de preço do produto',
    type: [ProductPriceDto],
  })
  @IsArray({ message: 'O campo [price] precisa ser um array.' })
  @ArrayNotEmpty({ message: 'O campo [price] não pode estar vazio.' })
  @ValidateNested({ each: true })
  @Type(() => ProductPriceDto)
  prices: ProductPriceDto[];

  @ApiPropertyOptional({
    example: true,
    description: 'Define se o produto está ativo',
  })
  @IsOptional()
  @IsBoolean({ message: 'O campo [isActive] precisa ser booleano.' })
  isActive?: boolean;
}
