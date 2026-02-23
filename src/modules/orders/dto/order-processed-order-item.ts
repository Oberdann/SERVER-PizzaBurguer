import { Types } from 'mongoose';

export interface OrderProcessedOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  slices?: number;
  size?: string;
  unitPrice: number;
  totalPrice: number;
}
