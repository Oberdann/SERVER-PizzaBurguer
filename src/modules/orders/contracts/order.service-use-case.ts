import { OrderStatus } from 'src/common/enums/order-status-enum';
import { OrderResponseDto } from '../dto/order-response-dto';
import { OrderCreateDto } from '../dto/order-create-dto';

export interface IOrdersService {
  getAll(): Promise<OrderResponseDto[]>;

  getById(id: string): Promise<OrderResponseDto>;

  create(orderDto: OrderCreateDto): Promise<OrderResponseDto>;

  updateStatus(id: string, status: OrderStatus): Promise<OrderResponseDto>;

  cancel(id: string): Promise<OrderResponseDto>;
}
