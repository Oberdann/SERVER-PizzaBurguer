import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class IngredientCreateDto {
  @ApiProperty({
    example: 'Queijo',
    description: 'Nome do ingrediente',
  })
  @IsString({ message: 'O campo [name] precisa ser uma string.' })
  @IsNotEmpty({ message: 'O campo [name] não pode estar vazio.' })
  name: string;

  @ApiProperty({
    example: true,
    description: 'Define se o ingrediente está ativo',
  })
  @IsBoolean({ message: 'O campo [isActive] precisa ser booleano.' })
  @IsNotEmpty({ message: 'O campo [isActive] precisa estar preenchido.' })
  isActive: boolean;
}
