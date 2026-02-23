import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemCreateDto {
  @ApiProperty({
    example: '64f1c2e8a12b3c4d5e6f7890',
    description: 'ID do produto',
  })
  @IsMongoId({ message: 'O campo [productId] precisa ser um ObjectId válido.' })
  @IsNotEmpty({ message: 'O campo [productId] não pode estar vazio.' })
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'Quantidade do produto',
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'O campo [quantity] precisa ser um número.' })
  @Min(1, { message: 'O campo [quantity] deve ser no mínimo 1.' })
  quantity: number;

  @ApiPropertyOptional({
    example: 8,
    description: 'Quantidade de fatias (caso aplicável)',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: 'O campo [slices] precisa ser um número.' })
  slices?: number;

  @ApiPropertyOptional({
    example: 'Grande',
    description: 'Tamanho do produto (caso aplicável)',
  })
  @IsOptional()
  @IsString({ message: 'O campo [size] precisa ser uma string.' })
  size?: string;
}
