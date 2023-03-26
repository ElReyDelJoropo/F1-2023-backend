import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Items } from '../schemas/restaurant.schema';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsArray()
  @IsNotEmpty()
  items: Items[];
}
