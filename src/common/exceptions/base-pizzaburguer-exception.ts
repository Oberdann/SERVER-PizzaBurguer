import { HttpException, HttpStatus } from '@nestjs/common';

export class BasePizzaBurguerException extends HttpException {
  constructor(
    message: string = 'BasePizzaBurguerException error',
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode);
  }
}
