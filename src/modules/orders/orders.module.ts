import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrdersSchema } from 'src/database/orders.schema';
import { OrdersController } from './orders.controller';
import { OrderMapper } from './mappers/order.mapper';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrdersSchema }]),
    forwardRef(() => ProductsModule),
  ],
  controllers: [OrdersController],
  providers: [
    {
      provide: 'IOrdersService',
      useClass: OrdersService,
    },
    {
      provide: 'IOrderMapper',
      useClass: OrderMapper,
    },
  ],
  exports: [],
})
export class OrdersModule {}
