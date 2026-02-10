import { OrderStatus } from 'src/common/enums/order-status-enum';
import { IOrdersService } from './contracts/order.service-use-case';
import { OrderCreateDto } from './dto/order-create-dto';
import { OrderResponseDto } from './dto/order-response-dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from 'src/database/orders.schema';
import { Model } from 'mongoose';
import { IOrderMapper } from './contracts/order-mapper.interface';
import { Inject } from '@nestjs/common';

export class OrdersService implements IOrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,

    @Inject('IOrderMapper')
    private readonly mapper: IOrderMapper,
  ) {}

  getAll(): Promise<OrderResponseDto[]> {
    throw new Error('Method not implemented.');
  }

  getById(id: string): Promise<OrderResponseDto> {
    throw new Error('Method not implemented.');
  }

  create(orderDto: OrderCreateDto): Promise<OrderResponseDto> {
    throw new Error('Method not implemented.');
  }

  updateStatus(id: string, status: OrderStatus): Promise<OrderResponseDto> {
    throw new Error('Method not implemented.');
  }

  cancel(id: string): Promise<OrderResponseDto> {
    throw new Error('Method not implemented.');
  }
}
