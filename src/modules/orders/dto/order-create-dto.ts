import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item-dto';

export class OrderCreateDto {
  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome do cliente',
  })
  @IsString({ message: 'O campo [customerName] precisa ser uma string.' })
  @IsNotEmpty({ message: 'O campo [customerName] não pode estar vazio.' })
  customerName: string;

  @ApiProperty({
    example: '11999999999',
    description: 'Telefone do cliente',
  })
  @IsString({ message: 'O campo [customerPhone] precisa ser uma string.' })
  @IsNotEmpty({ message: 'O campo [customerPhone] não pode estar vazio.' })
  @Matches(/^[0-9]+$/, {
    message: 'O campo [customerPhone] deve conter apenas números.',
  })
  customerPhone: string;

  @ApiProperty({
    description: 'Itens do pedido',
    type: [OrderItemDto],
  })
  @IsArray({ message: 'O campo [items] precisa ser um array.' })
  @IsNotEmpty({ message: 'O campo [items] não pode estar vazio.' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
