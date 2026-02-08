import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdParamPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (metadata.type !== 'param') return value;

    const paramName = metadata.data?.toLowerCase();

    if (!paramName || !paramName.includes('id')) return value;

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `O ID "${value}" não é um ObjectId válido.`,
      );
    }

    return value;
  }
}
