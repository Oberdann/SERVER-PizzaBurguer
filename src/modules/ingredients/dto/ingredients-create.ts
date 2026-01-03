import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class IngredientCreateDto {
  @ApiProperty({
    example: 'Queijo',
    description: 'Nome do ingrediente',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: true,
    description: 'Define se o ingrediente está ativo',
  })
  @IsBoolean()
  isActive: boolean;
}
