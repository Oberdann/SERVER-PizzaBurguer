import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IngredientUpdateNameDto {
  @ApiProperty({
    example: 'Tomate',
    description: 'Novo nome do ingrediente',
  })
  @IsString({ message: 'O tipo do campo [name] precisa ser string' })
  @IsNotEmpty({ message: 'O campo [name] nao pode ser vazio.' })
  name: string;
}
