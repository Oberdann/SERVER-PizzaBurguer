import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IngredientDocument = HydratedDocument<Ingredient>;

@Schema()
export class Ingredient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isActive: boolean;
}

export const IngredientsSchema = SchemaFactory.createForClass(Ingredient);
