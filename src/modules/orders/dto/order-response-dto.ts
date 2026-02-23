import { OrderStatus } from 'src/common/enums/order-status-enum';
import { OrderAddressResponseDto } from './order-address-dto';
import { OrderCostumerDto } from './order-costumer-dto';
import { OrderItemDto } from './order-item-dto';

export class OrderResponseDto {
  id: string;
  status: OrderStatus;
  customer: OrderCostumerDto;
  address: OrderAddressResponseDto;
  items: OrderItemDto[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
