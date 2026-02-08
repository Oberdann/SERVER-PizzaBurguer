import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductPriceDto {
  @ApiPropertyOptional({
    example: 8,
    description: 'Quantidade de fatias (usado quando priceMode = SLICE)',
  })
  @IsOptional()
  slices?: number;

  @ApiPropertyOptional({
    example: '2L',
    description: 'Tamanho do produto (usado quando priceMode = SIZE)',
  })
  @IsOptional()
  @IsString({ message: 'O campo [size] precisa ser uma string.' })
  size?: string;

  @ApiProperty({
    example: 55,
    description: 'Valor do item',
  })
  @IsNumber({}, { message: 'O campo [value] precisa ser um número.' })
  @IsNotEmpty({ message: 'O campo [value] não pode estar vazio.' })
  value: number;
}
