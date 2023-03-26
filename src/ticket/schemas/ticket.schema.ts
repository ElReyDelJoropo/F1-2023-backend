import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { SeatPosition, TicketType } from '../dto/create-ticket.dto';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema()
export class Ticket {
  @Prop({ required: true })
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true })
  emitedAt: number;

  @Prop({ required: true, enum: [TicketType.normal, TicketType.vip] })
  type: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  seatPosition: SeatPosition;

  @Prop({ required: true })
  day: number;

  @Prop({ default: false })
  confirmed: boolean;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
