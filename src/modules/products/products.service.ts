import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { IngredientDocument } from 'src/database/ingredients.schema';
import { IProductsService } from './contracts/product.service-use-case';
import { Product, ProductDocument } from 'src/database/products.schema';
import { IProductMapper } from './contracts/product-mapper-interface';
import { IIngredientsService } from '../ingredients/contracts/ingredient.service-use-case';
import { ProductCategory } from 'src/common/enums/product-category-enum';
import { ProductResponseDto } from './dto/product-response-dto';
import { ProductNotFoundException } from './exceptions/exception-product-not-found';
import { ProductCreateDto } from './dto/product-create-dto';
import { ProductNoIngredientsIdDto } from './dto/product-no-ingredients-id-dto';
import { ProductStatusAlreadySetException } from './exceptions/exception-product-status-already';
import { PriceMode } from 'src/common/enums/price-mode-enum';
import { ProductInvalidSlicePriceModeException } from './exceptions/exception-product-invalid-slice-price';
import { ProductInvalidSizePriceModeException } from './exceptions/exception-product-invalid-size-price';
import { ProductInvalidNoSizePriceModeException } from './exceptions/exception-product-invalid-no-size-price';
import { ProductInvalidNoSlicePriceModeException } from './exceptions/exception-product-invalid-no-slice-price';

@Injectable()
export class ProductsService implements IProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    @Inject('IProductMapper')
    private readonly mapper: IProductMapper,

    @Inject(forwardRef(() => 'IIngredientsService'))
    private readonly ingredientsService: IIngredientsService,
  ) {}

  async getAll(filters?: {
    isActive?: boolean;
    category?: ProductCategory;
  }): Promise<ProductResponseDto[]> {
    const query: Partial<Pick<ProductDocument, 'isActive' | 'category'>> = {};

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters?.category) {
      query.category = filters.category;
    }

    const products = await this.productModel
      .find(query)
      .populate<{ ingredients: IngredientDocument[] }>('ingredients')
      .exec();

    const response = this.mapper.toResponseIngredientPopulateList(products);

    return response;
  }

  async getById(id: string): Promise<ProductResponseDto> {
    const products = await this.findByIdOrFail(id);

    await products.populate('ingredients');

    const response = this.mapper.toResponseIngredientPopulate(products);

    return response;
  }

  async create(productsDto: ProductCreateDto): Promise<ProductResponseDto> {
    await this.validateIngredientsExist(productsDto.ingredients);

    const priceModeRules = {
      [PriceMode.SLICE]: {
        required: 'slices',
        forbidden: 'size',
        requiredMessage:
          'O modo SLICE requer que todas as opções de preço tenham a propriedade [slices].',
        forbiddenMessage:
          'O modo SLICE não permite a propriedade [size] nas opções de preço.',
        RequiredException: ProductInvalidSlicePriceModeException,
        ForbiddenException: ProductInvalidNoSizePriceModeException,
      },
      [PriceMode.SIZE]: {
        required: 'size',
        forbidden: 'slices',
        requiredMessage:
          'O modo SIZE requer que todas as opções de preço tenham a propriedade [size].',
        forbiddenMessage:
          'O modo SIZE não permite a propriedade [slices] nas opções de preço.',
        RequiredException: ProductInvalidSizePriceModeException,
        ForbiddenException: ProductInvalidNoSlicePriceModeException,
      },
    };

    const rule = priceModeRules[productsDto.priceMode];

    for (const price of productsDto.prices) {
      const isMissingRequired = price[rule.required] === undefined;
      const hasForbiddenField = price[rule.forbidden] !== undefined;

      if (isMissingRequired) {
        throw new rule.RequiredException(rule.requiredMessage, 400);
      }

      if (hasForbiddenField) {
        throw new rule.ForbiddenException(rule.forbiddenMessage, 400);
      }
    }

    const productsData = this.mapper.toDocument(productsDto);

    const products = await this.productModel.create(productsData);

    await products.populate('ingredients');

    const response = this.mapper.toResponseIngredientPopulate(products);

    return response;
  }

  async updateName(
    id: string,
    name: string,
  ): Promise<ProductNoIngredientsIdDto> {
    const products = await this.findByIdOrFail(id);

    products.name = name;

    await products.save();

    const response = this.mapper.toResponseNoIngredientId(products);

    return response;
  }

  async updateStatus(
    id: string,
    isActive: boolean,
  ): Promise<ProductNoIngredientsIdDto> {
    const products = await this.findByIdOrFail(id);

    if (products.isActive === isActive) {
      throw new ProductStatusAlreadySetException(
        `O produto com ID ${id} ja está ${isActive ? 'ativo' : 'inativo'}.`,
      );
    }

    products.isActive = isActive;

    await products.save();

    const response = this.mapper.toResponseNoIngredientId(products);

    return response;
  }

  async addIngredients(
    id: string,
    ingredientIds: string[],
  ): Promise<ProductResponseDto> {
    await this.findByIdOrFail(id);

    await this.validateIngredientsExist(ingredientIds);

    const productsUpdated = await this.productModel
      .findByIdAndUpdate(
        id,
        {
          $addToSet: {
            ingredients: { $each: ingredientIds },
          },
        },
        { new: true },
      )
      .populate<{
        ingredients: IngredientDocument[];
      }>('ingredients');

    if (!productsUpdated) {
      throw new ProductNotFoundException(
        `O produto com ID ${id} não foi encontrado.`,
        404,
      );
    }

    const response = this.mapper.toResponseIngredientPopulate(productsUpdated);

    return response;
  }

  async removeIngredients(
    id: string,
    ingredientIds: string[],
  ): Promise<ProductResponseDto> {
    await this.findByIdOrFail(id);

    await Promise.all(
      ingredientIds.map((id) => this.ingredientsService.getById(id)),
    );

    const productsUpdated = await this.productModel
      .findByIdAndUpdate(
        id,
        {
          $pull: {
            ingredients: { $in: ingredientIds },
          },
        },
        { new: true },
      )
      .populate<{
        ingredients: IngredientDocument[];
      }>('ingredients');

    if (!productsUpdated) {
      throw new ProductNotFoundException(
        `O produto com ID ${id} não foi encontrado.`,
        404,
      );
    }

    const response = this.mapper.toResponseIngredientPopulate(productsUpdated);

    return response;
  }

  async delete(id: string): Promise<void> {
    await this.findByIdOrFail(id);

    await this.productModel.deleteOne({ _id: id });
  }

  private async findByIdOrFail(id: string) {
    const ingredientEntity = await this.productModel.findById(id);

    if (!ingredientEntity) {
      throw new ProductNotFoundException(
        `O produto com ID ${id} não foi encontrado.`,
        404,
      );
    }

    return ingredientEntity;
  }

  async removeIngredientFromAllProducts(ingredientId: string): Promise<void> {
    await this.productModel.updateMany(
      { ingredients: ingredientId },
      { $pull: { ingredients: ingredientId } },
    );
  }

  private async validateIngredientsExist(
    ingredientIds: string[],
  ): Promise<void> {
    await Promise.all(
      ingredientIds.map((id) => this.ingredientsService.getById(id)),
    );
  }
}
