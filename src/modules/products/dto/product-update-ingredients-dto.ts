import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ProductUpdateIngredientsDto {
  @ApiProperty({
    example: ['ingredienteId1', 'ingredienteId2'],
    description: 'IDs dos ingredientes atualizados',
    type: [String],
  })
  @IsArray({ message: 'O campo [ingredientsId] precisa ser um array.' })
  @ArrayNotEmpty({ message: 'O campo [ingredientsId] não pode estar vazio.' })
  @IsString({
    each: true,
    message: 'Todos os itens do campo [ingredientsId] precisam ser strings.',
  })
  ingredientsId: string[];
}
