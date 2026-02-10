import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  HttpCode,
  Inject,
} from '@nestjs/common';

import { Ok } from 'src/common/utils/response.util';
import { IOrdersService } from './contracts/order.service-use-case';
import { OrderCreateDto } from './dto/order-create-dto';
import { OrderStatus } from 'src/common/enums/order-status-enum';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('IOrdersService')
    private readonly orderService: IOrdersService,
  ) {}

  @HttpCode(200)
  @Get()
  async getAll() {
    const response = await this.orderService.getAll();

    return Ok('Pedidos encontrados com sucesso', response);
  }

  @HttpCode(200)
  @Get(':id')
  async getById(@Param('id') id: string) {
    const response = await this.orderService.getById(id);

    return Ok('Pedido encontrado com sucesso.', response);
  }

  @HttpCode(201)
  @Post()
  async create(@Body() order: OrderCreateDto) {
    const response = await this.orderService.create(order);

    return Ok('Pedido criado com sucesso.', response);
  }

  @HttpCode(200)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
  ) {
    const response = await this.orderService.updateStatus(id, body.status);

    return Ok('Status do pedido atualizado com sucesso.', response);
  }

  @HttpCode(200)
  @Put(':id/cancel')
  async cancel(@Param('id') id: string) {
    const response = await this.orderService.cancel(id);

    return Ok('Pedido cancelado com sucesso.', response);
  }
}
