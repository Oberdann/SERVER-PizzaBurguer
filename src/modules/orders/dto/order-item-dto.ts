import { OrderPricingDto } from './order-pricing-dto';

export class OrderItemDto {
  productId: string;
  productName: string;
  pricing: OrderPricingDto;
  quantity: number;
  totalPrice: number;
}
