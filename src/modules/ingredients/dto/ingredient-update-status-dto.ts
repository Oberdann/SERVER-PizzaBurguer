import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateIngredientStatusDto {
  @ApiProperty({
    example: 'false',
    description: 'Novo status do ingrediente',
  })
  @IsBoolean({ message: 'O campo [isActive] precisa ser booleano.' })
  @IsNotEmpty({ message: 'O campo [isActive] precisa estar preenchida.' })
  isActive: boolean;
}
