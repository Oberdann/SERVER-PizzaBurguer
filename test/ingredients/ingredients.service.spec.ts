import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { IIngredientMapper } from 'src/modules/ingredients/contracts/ingredient-mapper-interface';
import { IngredientResponseDto } from 'src/modules/ingredients/dto/ingredient-response-dto';
import { IngredientsService } from 'src/modules/ingredients/ingredients.service';
import { IProductsService } from 'src/modules/products/contracts/product.service-use-case';

describe('IngredientsService', () => {
  let service: IngredientsService;
  let ingredientModel: any;
  let mapper: jest.Mocked<IIngredientMapper>;
  // let productsService: Partial<jest.Mocked<IProductsService>>;

  const mockIngredient = {
    _id: new Types.ObjectId(),
    name: 'Queijo',
    isActive: true,
    save: jest.fn(),
    populate: jest.fn().mockResolvedValue(this),
  };

  const mockIngredientsResponse: IngredientResponseDto = {
    id: mockIngredient._id.toHexString(),
    name: mockIngredient.name,
    isActive: mockIngredient.isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockMapper: jest.Mocked<IIngredientMapper> = {
    toResponse: jest.fn(),
    toResponseList: jest.fn(),
  };

  const mockProductsService: Partial<jest.Mocked<IProductsService>> = {
    getById: jest.fn(),
  };

  const mockIngredientModel = {
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
        IngredientsService,
        { provide: getModelToken('Ingredient'), useValue: mockIngredientModel },
        { provide: 'IIngredientMapper', useValue: mockMapper },
        { provide: 'IProductsService', useValue: mockProductsService },
      ],
    }).compile();

    service = module.get<IngredientsService>(IngredientsService);
    ingredientModel = module.get(getModelToken('Ingredient'));
    mapper = module.get('IIngredientMapper');
    // productsService = module.get('IProductsService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('shold return ingredients mapped', async () => {
      ingredientModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockIngredient]),
        }),
      });

      mapper.toResponseList.mockReturnValue([mockIngredientsResponse]);

      const result = await service.getAll();

      expect(result).toEqual([mockIngredientsResponse]);
      expect(ingredientModel.getAll).toHaveBeenCalledWith({});
    });
  });
});
