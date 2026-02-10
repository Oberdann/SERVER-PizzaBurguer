import { OrderDocument } from 'src/database/orders.schema';
import { OrderResponseDto } from '../dto/order-response-dto';

export interface IOrderMapper {
  toResponse(doc: OrderDocument): OrderResponseDto;
  toResponseList(docs: OrderDocument[]): OrderResponseDto[];
}
