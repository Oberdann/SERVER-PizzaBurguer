import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from 'src/database/orders.schema';
import { IOrdersService } from './contracts/order.service-use-case';
import { IOrderMapper } from './contracts/order-mapper.interface';
import { OrderResponseDto } from './dto/order-response-dto';
import { OrderCreateDto } from './dto/order-create-dto';
import { OrderNotFoundException } from './exceptions/exception-order-not-found';
import { OrderStatus } from 'src/common/enums/order-status-enum';
import { IProductsService } from '../products/contracts/product.service-use-case';
import { PriceMode } from 'src/common/enums/price-mode-enum';

@Injectable()
export class OrdersService implements IOrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,

    @Inject('IOrderMapper')
    private readonly mapper: IOrderMapper,

    @Inject(forwardRef(() => 'IProductsService'))
    private readonly productsService: IProductsService,
  ) {}

  async getAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderModel.find();

    const response = this.mapper.toResponseList(orders);

    return response;
  }

  async getById(id: string): Promise<OrderResponseDto> {
    const order = await this.findByIdOrFail(id);

    const response = this.mapper.toResponse(order);

    return response;
  }

  async create(orderDto: OrderCreateDto): Promise<OrderResponseDto> {
    const items = await Promise.all(
      orderDto.items.map(async (item) => {
        const product = await this.productsService.getById(item.productId);

        let selectedPrice;

        if (product.priceMode === PriceMode.SLICE) {
          selectedPrice = product.prices.find((p) => p.slices === item.slices);
        }

        if (product.priceMode === PriceMode.SIZE) {
          selectedPrice = product.prices.find((p) => p.size === item.size);
        }

        if (!selectedPrice) {
          throw new Error('Variação de preço inválida.');
        }

        const unitPrice = selectedPrice.value;
        const totalPrice = unitPrice * item.quantity;

        return {
          productId: new Types.ObjectId(item.productId),
          quantity: item.quantity,
          slices: item.slices,
          size: item.size,
          unitPrice,
          totalPrice,
        };
      }),
    );

    const totalValue = items.reduce((acc, item) => acc + item.totalPrice, 0);

    const createdOrder = await this.orderModel.create({
      customerName: orderDto.customerName,
      customerPhone: orderDto.customerPhone,
      address: orderDto.address,
      items,
      total: totalValue,
      status: OrderStatus.CREATED,
    });

    const order = await this.orderModel
      .findById(createdOrder._id)
      .populate('items.productId');

    return this.mapper.toResponse(order!);
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<OrderResponseDto> {
    const order = await this.findByIdOrFail(id);

    order.status = status;

    await order.save();

    const response = this.mapper.toResponse(order);

    return response;
  }

  async cancel(id: string): Promise<OrderResponseDto> {
    const order = await this.findByIdOrFail(id);

    order.status = OrderStatus.CANCELED;

    await order.save();

    const response = this.mapper.toResponse(order);

    return response;
  }

  private async findByIdOrFail(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id);

    if (!order) {
      throw new OrderNotFoundException(
        `O pedido com ID ${id} não foi encontrado.`,
      );
    }

    return order;
  }
}
