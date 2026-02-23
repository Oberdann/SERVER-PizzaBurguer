import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemCreateDto } from './order-item-create-dto';
import { OrderAddressCreateDto } from './order-address-create-dto';

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
    description: 'Telefone do cliente (somente números)',
  })
  @IsString({ message: 'O campo [customerPhone] precisa ser uma string.' })
  @IsNotEmpty({ message: 'O campo [customerPhone] não pode estar vazio.' })
  @Matches(/^[0-9]+$/, {
    message: 'O campo [customerPhone] deve conter apenas números.',
  })
  customerPhone: string;

  @ApiProperty({
    type: OrderAddressCreateDto,
    description: 'Endereço do pedido',
  })
  @ValidateNested()
  @Type(() => OrderAddressCreateDto)
  address: OrderAddressCreateDto;

  @ApiProperty({
    type: [OrderItemCreateDto],
    description: 'Lista de itens do pedido',
  })
  @IsArray({ message: 'O campo [items] precisa ser um array.' })
  @IsNotEmpty({ message: 'O campo [items] não pode estar vazio.' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemCreateDto)
  items: OrderItemCreateDto[];
}
