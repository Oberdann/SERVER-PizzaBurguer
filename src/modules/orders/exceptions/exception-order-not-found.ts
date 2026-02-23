import { BasePizzaBurguerException } from 'src/common/exceptions/base-pizzaburguer-exception';

export class OrderNotFoundException extends BasePizzaBurguerException {
  constructor(message: string, statusCode: number = 404) {
    super(message, statusCode);
  }
}
