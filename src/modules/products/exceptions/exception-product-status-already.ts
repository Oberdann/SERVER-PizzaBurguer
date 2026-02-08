import { BasePizzaBurguerException } from 'src/common/exceptions/base-pizzaburguer-exception';

export class ProductStatusAlreadySetException extends BasePizzaBurguerException {
  constructor(message: string, code: number = 400) {
    super(message, code);
  }
}
