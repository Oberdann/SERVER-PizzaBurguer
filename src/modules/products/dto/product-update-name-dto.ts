import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProductUpdateNameDto {
  @ApiProperty({
    example: 'Pepperoni',
    description: 'Novo nome da pizza',
  })
  @IsString({ message: 'O campo [name] precisa ser uma string.' })
  @IsNotEmpty({ message: 'O campo [name] não pode estar vazio.' })
  name: string;
}
