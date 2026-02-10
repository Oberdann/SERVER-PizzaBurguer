import { OrderStatus } from 'src/common/enums/order-status-enum';
import { OrderAddressResponseDto } from './order-address-dto';

export class OrderResponseDto {
  id: string;
  status: OrderStatus;
  customer: OrderResponseDto;
  address: OrderAddressResponseDto;
  items: OrderResponseDto[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
