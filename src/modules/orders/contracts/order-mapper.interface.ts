import { OrderDocument } from 'src/database/orders.schema';
import { OrderResponseDto } from '../dto/order-response-dto';
import { OrderCreateDto } from '../dto/order-create-dto';
import { OrderProcessedOrderItem } from '../dto/order-processed-order-item';

export interface IOrderMapper {
  toResponse(doc: OrderDocument): OrderResponseDto;
  toResponseList(docs: OrderDocument[]): OrderResponseDto[];
  toDocument(
    dto: OrderCreateDto,
    items: OrderProcessedOrderItem[],
  ): Partial<OrderDocument>;
}
