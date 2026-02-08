import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ProductUpdateStatusDto {
  @ApiProperty({
    example: true,
    description: 'Define se a pizza está ativa',
  })
  @IsBoolean({ message: 'O campo [isActive] precisa ser booleano.' })
  @IsNotEmpty({ message: 'O campo [isActive] precisa estar preenchido.' })
  isActive: boolean;
}
