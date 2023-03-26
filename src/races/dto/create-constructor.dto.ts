import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConstructorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;
}
