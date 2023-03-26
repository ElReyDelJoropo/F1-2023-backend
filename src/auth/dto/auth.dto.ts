import { IsNumber, IsString, Max, Min } from 'class-validator';
import { limits } from 'src/configuration';

export class AuthDto {
  @IsNumber()
  @Min(limits.dni.min)
  @Max(limits.dni.max)
  dni: number;

  @IsString()
  password: string;
}
