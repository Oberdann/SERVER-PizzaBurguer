import { BasePizzaBurguerException } from 'src/common/exceptions/base-pizzaburguer-exception';

export class ProductNotFoundException extends BasePizzaBurguerException {
  constructor(message: string, code: number = 404) {
    super(message, code);
  }
}
