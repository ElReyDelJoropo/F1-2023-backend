import { IsEnum, IsNumber, ValidateNested } from 'class-validator';

export class SeatPosition {
  @IsNumber()
  row: number;

  @IsNumber()
  column: number;
}

export enum TicketType {
  normal = 'general',
  vip = 'vip',
}

export class CreateTicketDto {
  @IsEnum(TicketType)
  type: TicketType;

  @ValidateNested()
  seatPosition: SeatPosition;
}
