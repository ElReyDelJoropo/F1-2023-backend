import { IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  dni: string;

  @IsString()
  password: string;
}
