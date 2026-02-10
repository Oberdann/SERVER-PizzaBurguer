import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrdersSchema } from 'src/database/orders.schema';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrdersSchema }]),
  ],
  controllers: [OrdersController],
  providers: [
    {
      provide: 'IOrderService',
      useClass: OrdersService,
    },
    {
      provide: 'IOrderMapper',
      useClass: OrdersService,
    },
  ],
  exports: [],
})
export class OrderssModule {}
