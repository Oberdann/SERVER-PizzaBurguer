import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ProductsService } from 'src/modules/products/products.service';
import { IProductMapper } from 'src/modules/products/contracts/product-mapper-interface';
import { IIngredientsService } from 'src/modules/ingredients/contracts/ingredient.service-use-case';
import { ProductCategory } from 'src/common/enums/product-category-enum';
import { ProductNotFoundException } from 'src/modules/products/exceptions/exception-product-not-found';
import { ProductCreateDto } from 'src/modules/products/dto/product-create-dto';
import { ProductStatusAlreadySetException } from 'src/modules/products/exceptions/exception-product-status-already';
import { ProductResponseDto } from 'src/modules/products/dto/product-response-dto';
import { ProductNoIngredientsIdDto } from 'src/modules/products/dto/product-no-ingredients-id-dto';
import { ProductType } from 'src/common/enums/product-type-enum';
import { PriceMode } from 'src/common/enums/price-mode-enum';
import { ProductInvalidSlicePriceModeException } from 'src/modules/products/exceptions/exception-product-invalid-slice-price';
import { ProductInvalidNoSizePriceModeException } from 'src/modules/products/exceptions/exception-product-invalid-no-size-price';
import { ProductInvalidSizePriceModeException } from 'src/modules/products/exceptions/exception-product-invalid-size-price';
import { ProductInvalidNoSlicePriceModeException } from 'src/modules/products/exceptions/exception-product-invalid-no-slice-price';

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: any;
  let mapper: jest.Mocked<IProductMapper>;
  let ingredientsService: Partial<jest.Mocked<IIngredientsService>>;

  const mockProduct = {
    _id: new Types.ObjectId(),
    name: 'Produto Teste',
    isActive: true,
    ingredients: [],
    category: ProductCategory.COXINHA,
    save: jest.fn(),
    populate: jest.fn().mockResolvedValue(this),
  };

  const mockProductResponseDto: ProductResponseDto = {
    id: mockProduct._id.toHexString(),
    name: mockProduct.name,
    isActive: mockProduct.isActive,
    ingredients: [],
    category: mockProduct.category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: ProductType.PIZZA,
    priceMode: PriceMode.SLICE,
    prices: [],
  };

  const mockProductNoIngredientsDto: ProductNoIngredientsIdDto = {
    id: mockProduct._id.toHexString(),
    name: mockProduct.name,
    isActive: mockProduct.isActive,
    category: mockProduct.category,
  };

  const mockMapper: jest.Mocked<IProductMapper> = {
    toResponseIngredientPopulateList: jest.fn(),
    toResponseIngredientPopulate: jest.fn(),
    toResponseNoIngredientId: jest.fn(),
    toDocument: jest.fn(),
  };

  const mockIngredientsService: Partial<jest.Mocked<IIngredientsService>> = {
    getById: jest.fn(),
  };

  const mockProductModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    updateMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getModelToken('Product'), useValue: mockProductModel },
        { provide: 'IProductMapper', useValue: mockMapper },
        { provide: 'IIngredientsService', useValue: mockIngredientsService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get(getModelToken('Product'));
    mapper = module.get('IProductMapper');
    ingredientsService = module.get('IIngredientsService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return products mapped', async () => {
      productModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockProduct]),
        }),
      });

      mapper.toResponseIngredientPopulateList.mockReturnValue([
        mockProductResponseDto,
      ]);

      const result = await service.getAll();

      expect(result).toEqual([mockProductResponseDto]);
      expect(productModel.find).toHaveBeenCalledWith({});
    });

    it('should apply filters', async () => {
      productModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockProduct]),
        }),
      });

      mapper.toResponseIngredientPopulateList.mockReturnValue([
        mockProductResponseDto,
      ]);

      const result = await service.getAll({
        isActive: true,
        category: ProductCategory.COXINHA,
      });

      expect(productModel.find).toHaveBeenCalledWith({
        isActive: true,
        category: ProductCategory.COXINHA,
      });
      expect(result).toEqual([mockProductResponseDto]);
    });
  });

  describe('getById', () => {
    it('should return a mapped product', async () => {
      jest
        .spyOn(service as any, 'findByIdOrFail')
        .mockResolvedValue(mockProduct);

      mockProduct.populate.mockResolvedValue(mockProduct);
      mapper.toResponseIngredientPopulate.mockReturnValue(
        mockProductResponseDto,
      );

      const result = await service.getById('1');

      expect(result).toEqual(mockProductResponseDto);
      expect(mockProduct.populate).toHaveBeenCalledWith('ingredients');
    });

    it('should throw if product not found', async () => {
      jest
        .spyOn(service as any, 'findByIdOrFail')
        .mockRejectedValue(new ProductNotFoundException('not found', 404));

      await expect(service.getById('1')).rejects.toThrow(
        ProductNotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create product and return mapped', async () => {
      const dto: ProductCreateDto = {
        name: 'Produto Teste',
        type: ProductType.PIZZA,
        category: ProductCategory.COXINHA,
        ingredients: [],
        priceMode: PriceMode.SLICE,
        prices: [
          {
            slices: 8,
            value: 50,
          },
        ],
        isActive: true,
      };

      const productDocumentMock = {
        ...dto,
        ingredients: [],
        _id: new Types.ObjectId(),
        save: jest.fn(),
        populate: jest.fn().mockResolvedValue(mockProduct),
      };

      mapper.toDocument.mockReturnValue(productDocumentMock);
      productModel.create.mockResolvedValue(mockProduct);
      mockProduct.populate.mockResolvedValue(mockProduct);
      mapper.toResponseIngredientPopulate.mockReturnValue(
        mockProductResponseDto,
      );

      jest
        .spyOn(service as any, 'validateIngredientsExist')
        .mockResolvedValue(undefined);

      const result = await service.create(dto);

      expect(result).toEqual(mockProductResponseDto);
      expect(productModel.create).toHaveBeenCalledWith(productDocumentMock);
    });

    it('should throw when SLICE mode and price without slices', async () => {
      const dto: ProductCreateDto = {
        name: 'Teste',
        type: ProductType.PIZZA,
        category: ProductCategory.COXINHA,
        ingredients: [],
        priceMode: PriceMode.SLICE,
        prices: [{ value: 50 }],
        isActive: true,
      };

      await expect(service.create(dto)).rejects.toThrow(
        ProductInvalidSlicePriceModeException,
      );
    });

    it('should throw when SLICE mode contains size', async () => {
      const dto: ProductCreateDto = {
        name: 'Teste',
        type: ProductType.PIZZA,
        category: ProductCategory.COXINHA,
        ingredients: [],
        priceMode: PriceMode.SLICE,
        prices: [{ slices: 8, size: 'G', value: 50 }],
        isActive: true,
      };

      await expect(service.create(dto)).rejects.toThrow(
        ProductInvalidNoSizePriceModeException,
      );
    });

    it('should throw when SIZE mode and missing size', async () => {
      const dto: ProductCreateDto = {
        name: 'Teste',
        type: ProductType.PIZZA,
        category: ProductCategory.COXINHA,
        ingredients: [],
        priceMode: PriceMode.SIZE,
        prices: [{ value: 50 }],
        isActive: true,
      };

      await expect(service.create(dto)).rejects.toThrow(
        ProductInvalidSizePriceModeException,
      );
    });

    it('should throw when SIZE mode contains slices', async () => {
      const dto: ProductCreateDto = {
        name: 'Teste',
        type: ProductType.PIZZA,
        category: ProductCategory.COXINHA,
        ingredients: [],
        priceMode: PriceMode.SIZE,
        prices: [{ size: 'G', slices: 8, value: 50 }],
        isActive: true,
      };

      await expect(service.create(dto)).rejects.toThrow(
        ProductInvalidNoSlicePriceModeException,
      );
    });
  });

  describe('updateName', () => {
    it('should update product name and return mapped', async () => {
      jest
        .spyOn(service as any, 'findByIdOrFail')
        .mockResolvedValue(mockProduct);

      mapper.toResponseNoIngredientId.mockReturnValue(
        mockProductNoIngredientsDto,
      );

      const result = await service.updateName('1', 'Novo Nome');

      expect(mockProduct.name).toBe('Novo Nome');
      expect(mockProduct.save).toHaveBeenCalled();
      expect(result).toBe(mockProductNoIngredientsDto);
    });
  });

  describe('updateStatus', () => {
    it('should update status and return mapped', async () => {
      jest
        .spyOn(service as any, 'findByIdOrFail')
        .mockResolvedValue(mockProduct);

      mockProduct.isActive = false;

      mapper.toResponseNoIngredientId.mockReturnValue(
        mockProductNoIngredientsDto,
      );

      const result = await service.updateStatus('1', true);

      expect(mockProduct.isActive).toBe(true);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(result).toBe(mockProductNoIngredientsDto);
    });

    it('should throw if status already set', async () => {
      jest
        .spyOn(service as any, 'findByIdOrFail')
        .mockResolvedValue(mockProduct);

      mockProduct.isActive = true;

      await expect(service.updateStatus('1', true)).rejects.toThrow(
        ProductStatusAlreadySetException,
      );
    });
  });

  describe('addIngredients', () => {
    it('should add ingredients and return mapped', async () => {
      jest
        .spyOn(service as any, 'findByIdOrFail')
        .mockResolvedValue(mockProduct);

      jest
        .spyOn(service as any, 'validateIngredientsExist')
        .mockResolvedValue(undefined);

      const updatedProduct = { ...mockProduct };

      productModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(updatedProduct),
      } as any);

      mapper.toResponseIngredientPopulate.mockReturnValue(
        mockProductResponseDto,
      );

      const result = await service.addIngredients('1', ['ing1']);

      expect(result).toBe(mockProductResponseDto);
    });

    it('should throw if product not found', async () => {
      jest
        .spyOn(service as any, 'findByIdOrFail')
        .mockResolvedValue(mockProduct);

      jest
        .spyOn(service as any, 'validateIngredientsExist')
        .mockResolvedValue(undefined);

      productModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.addIngredients('1', ['ing1'])).rejects.toThrow(
        ProductNotFoundException,
      );
    });
  });

  describe('removeIngredients', () => {
    it('should remove ingredients and return mapped', async () => {
      jest
        .spyOn(service as any, 'findByIdOrFail')
        .mockResolvedValue(mockProduct);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ingredientsService.getById!.mockResolvedValue({} as any);

      const updatedProduct = { ...mockProduct };

      productModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(updatedProduct),
      } as any);

      mapper.toResponseIngredientPopulate.mockReturnValue(
        mockProductResponseDto,
      );

      const result = await service.removeIngredients('1', ['ing1']);

      expect(result).toBe(mockProductResponseDto);
    });

    it('should throw if product not found', async () => {
      jest
        .spyOn(service as any, 'findByIdOrFail')
        .mockResolvedValue(mockProduct);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ingredientsService.getById!.mockResolvedValue({} as any);

      productModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.removeIngredients('1', ['ing1'])).rejects.toThrow(
        ProductNotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete product', async () => {
      jest
        .spyOn(service as any, 'findByIdOrFail')
        .mockResolvedValue(mockProduct);

      productModel.deleteOne.mockResolvedValue({});

      await service.delete('1');

      expect(productModel.deleteOne).toHaveBeenCalledWith({ _id: '1' });
    });

    it('should throw if product not found', async () => {
      jest
        .spyOn(service as any, 'findByIdOrFail')
        .mockRejectedValue(new ProductNotFoundException('not found', 404));

      await expect(service.delete('1')).rejects.toThrow(
        ProductNotFoundException,
      );
    });
  });
});
