import {
  IsArray,
  IsDateString,
  IsNumberString,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateRestaurantDto } from 'src/restaurant/dto/create-restaurant.dto';

export class Location {
  lat: number;
  long: number;
  locality: string;
  country: string;
}

class Circuit {
  @IsString()
  circuitId: string;

  @IsString()
  name: string;

  @ValidateNested()
  location: Location;
}

export class SeatMapDto {
  @IsArray()
  vip: number[];

  @IsArray()
  general: number[];
}

export class CreateRaceDto {
  @IsNumberString({ no_symbols: true })
  round: string;

  @IsString()
  name: string;

  @ValidateNested()
  map: SeatMapDto;

  @IsDateString()
  date: string;

  @ValidateNested()
  circuit: Circuit;

  @ValidateNested()
  restaurants: CreateRestaurantDto[];
}
