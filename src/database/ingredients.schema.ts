import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IngredientDocument = HydratedDocument<Ingredient>;

@Schema({ timestamps: true })
export class Ingredient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export const IngredientsSchema = SchemaFactory.createForClass(Ingredient);
