import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateBannerDto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;
}
