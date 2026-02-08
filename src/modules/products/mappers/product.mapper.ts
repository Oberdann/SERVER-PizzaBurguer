import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductResponseDto } from '../dto/product-response-dto';
import { ProductDocument } from 'src/database/products.schema';
import { ProductNoIngredientsIdDto } from '../dto/product-no-ingredients-id-dto';
import { ProductCreateDto } from '../dto/product-create-dto';
import { IProductMapper } from '../contracts/product-mapper-interface';

@Injectable()
export class ProductMapper implements IProductMapper {
  toDocument(dto: ProductCreateDto): Partial<ProductDocument> {
    return {
      name: dto.name,
      type: dto.type,
      category: dto.category,
      priceMode: dto.priceMode,
      prices: dto.prices,
      ingredients: dto.ingredients
        ? dto.ingredients.map((id) => new Types.ObjectId(id))
        : [],
      isActive: dto.isActive ?? true,
    };
  }

  toResponseNoIngredientId(doc: ProductDocument): ProductNoIngredientsIdDto {
    return {
      id: doc.id,
      name: doc.name,
      category: doc.category,
      isActive: doc.isActive,
    };
  }

  toResponseIngredientPopulate(doc: ProductDocument): ProductResponseDto {
    return {
      id: doc.id,
      name: doc.name,
      type: doc.type,
      category: doc.category,
      ingredients: doc.ingredients.map((ing) => ({
        id: ing._id.toString(),
        name: ing.name,
        isActive: ing.isActive,
      })),
      priceMode: doc.priceMode,
      prices: doc.prices.map((price) => ({
        slices: price.slices,
        size: price.size,
        value: price.value,
      })),
      isActive: doc.isActive,
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString(),
    };
  }

  toResponseIngredientPopulateList(
    docs: ProductDocument[],
  ): ProductResponseDto[] {
    return docs.map((doc) => this.toResponseIngredientPopulate(doc));
  }
}
