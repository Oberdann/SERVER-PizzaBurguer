import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OrderStatus } from 'src/common/enums/order-status-enum';
import { Product } from './products.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: false,
  })
  userId?: Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.CREATED,
  })
  status: OrderStatus;

  @Prop({
    type: [
      {
        _id: false,

        productId: {
          type: Types.ObjectId,
          ref: Product.name,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        slices: {
          type: Number,
          required: false,
        },

        size: {
          type: String,
          required: false,
        },

        unitPrice: {
          type: Number,
          required: true,
        },

        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  })
  items: {
    productId: Types.ObjectId;
    quantity: number;
    slices?: number;
    size?: string;
    unitPrice: number;
    totalPrice: number;
  }[];

  @Prop({
    type: {
      street: { type: String, required: true },
      number: { type: String, required: true },
      complement: { type: String, required: false },
      city: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  address: {
    street: string;
    number: string;
    complement?: string;
    city: string;
  };

  @Prop({
    type: Number,
    required: true,
  })
  total: number;

  createdAt: Date;
  updatedAt: Date;
}

export const OrdersSchema = SchemaFactory.createForClass(Order);
