import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from 'src/common/enums/order-status-enum';

export class OrderUpdateStatusDto {
  @ApiProperty({
    description: 'Novo status do pedido',
    enum: OrderStatus,
    example: OrderStatus.PREPARING,
  })
  @IsEnum(OrderStatus, { message: 'Status inválido' })
  @IsNotEmpty({ message: 'O campo status é obrigatório' })
  status: OrderStatus;
}
