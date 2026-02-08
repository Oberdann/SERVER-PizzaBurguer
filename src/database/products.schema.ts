import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Ingredient, IngredientDocument } from './ingredients.schema';
import { ProductCategory } from 'src/common/enums/product-category-enum';
import { ProductType } from 'src/common/enums/product-type-enum';
import { PriceMode } from 'src/common/enums/price-mode-enum';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: String,
    enum: Object.values(ProductType),
    required: true,
  })
  type: ProductType;

  @Prop({
    type: String,
    enum: Object.values(ProductCategory),
    required: true,
  })
  category: ProductCategory;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Ingredient.name }],
    default: [],
  })
  ingredients: IngredientDocument[] | Types.ObjectId[];

  @Prop({
    type: String,
    enum: Object.values(PriceMode),
    required: true,
  })
  priceMode: PriceMode;

  @Prop({
    type: [
      {
        _id: false,
        slices: { type: Number, required: false },
        size: { type: String, required: false },
        value: { type: Number, required: true },
      },
    ],
    required: true,
  })
  prices: {
    slices?: number;
    size?: string;
    value: number;
  }[];

  @Prop({ default: true })
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const ProductsSchema = SchemaFactory.createForClass(Product);
