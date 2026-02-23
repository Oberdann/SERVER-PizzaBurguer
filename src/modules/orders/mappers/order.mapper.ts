import { OrderDocument } from 'src/database/orders.schema';
import { IOrderMapper } from '../contracts/order-mapper.interface';
import { OrderResponseDto } from '../dto/order-response-dto';
import { OrderCreateDto } from '../dto/order-create-dto';
import { OrderProcessedOrderItem } from '../dto/order-processed-order-item';

export class OrderMapper implements IOrderMapper {
  toDocument(
    dto: OrderCreateDto,
    items: OrderProcessedOrderItem[],
  ): Partial<OrderDocument> {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

    return {
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      address: dto.address,
      items,
      total,
    };
  }

  toResponse(doc: OrderDocument): OrderResponseDto {
    return {
      id: doc._id.toString(),
      status: doc.status,
      customer: {
        name: doc.customerName,
        phone: doc.customerPhone,
      },
      address: {
        street: doc.address.street,
        number: doc.address.number,
        complement: doc.address.complement,
        city: doc.address.city,
      },
      items: doc.items.map((item: any) => ({
        productId: item.productId._id.toString(),
        productName: item.productId.name,
        pricing: {
          label: item.size ? `Tamanho ${item.size}` : `${item.slices} fatias`,
          unitPrice: item.unitPrice,
        },
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),

      total: doc.total,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  toResponseList(docs: OrderDocument[]): OrderResponseDto[] {
    return docs.map((doc) => this.toResponse(doc));
  }
}
