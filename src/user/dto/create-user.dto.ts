import { IsNumber, IsNumberString, IsString, Max, Min } from 'class-validator';
import { limits } from 'src/configuration';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsNumber()
  @Min(limits.dni.min)
  @Max(limits.dni.max)
  dni: number;

  @IsNumber()
  @Min(14)
  @Max(99)
  age: number;

  @IsString()
  password: string;
}
