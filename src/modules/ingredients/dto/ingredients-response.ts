import { ApiProperty } from '@nestjs/swagger';

export class IngredientResponseDto {
  @ApiProperty({ example: '64f1a2b3c4d5e6f7a8b9c0d1' })
  id: string;

  @ApiProperty({ example: 'Queijo' })
  name: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-01-03T18:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-01-03T18:00:00.000Z' })
  updatedAt: string;
}
