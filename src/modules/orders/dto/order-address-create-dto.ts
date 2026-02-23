import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrderAddressCreateDto {
  @ApiProperty({
    example: 'Rua das Flores',
    description: 'Rua do endereço',
  })
  @IsString({ message: 'O campo [street] precisa ser uma string.' })
  @IsNotEmpty({ message: 'O campo [street] não pode estar vazio.' })
  street: string;

  @ApiProperty({
    example: '123',
    description: 'Número do endereço',
  })
  @IsString({ message: 'O campo [number] precisa ser uma string.' })
  @IsNotEmpty({ message: 'O campo [number] não pode estar vazio.' })
  number: string;

  @ApiProperty({
    example: 'Apto 45',
    description: 'Complemento do endereço',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O campo [complement] precisa ser uma string.' })
  complement?: string;

  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade do endereço',
  })
  @IsString({ message: 'O campo [city] precisa ser uma string.' })
  @IsNotEmpty({ message: 'O campo [city] não pode estar vazio.' })
  city: string;
}
