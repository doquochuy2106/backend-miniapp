import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  originalPrice: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  detail?: string;
}
