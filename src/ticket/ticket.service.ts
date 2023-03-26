import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DayService } from 'src/day/day.service';
import { RaceService } from 'src/races/race/race.service';
import { UserService } from 'src/user/user.service';
import { CreateTicketDto, TicketType } from './dto/create-ticket.dto';
import { Ticket, TicketDocument } from './schemas/ticket.schema';

@Injectable()
export class TicketService {
  private readonly NORMAL_PRICE = 150;
  private readonly VIP_PRICE = 340;
  private readonly TAX = 1.16;

  private currentDay = 0;
  private currentSeatMap: {
    general: number[][];
    vip: number[][];
  } = {
    general: [],
    vip: [],
  };

  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    private readonly userService: UserService,
    private readonly dayService: DayService,
    private readonly raceService: RaceService,
  ) {}

  async create(dni: number, createTicketDto: CreateTicketDto) {
    const price = this.getPrice(dni, createTicketDto.type);

    await this.checkDay();

    if (!this.isValidSeat(createTicketDto)) return null;

    const ticketDoc = new this.ticketModel({
      ...createTicketDto,
      emitedAt: Date.now(),
      day: this.dayService.getDay(),
      price,
    });

    ticketDoc.id = this.generateId(dni, ticketDoc.emitedAt);
    const user = await this.userService.findBy({ dni }).lean();

    if (!user) throw new NotFoundException('Unexpected error, user not found');

    ticketDoc.user = user._id;
    this.setSeat(createTicketDto);

    return ticketDoc.save();
  }

  async confirm(ticketId: string) {
    const ticket = await this.ticketModel.findOne({ id: ticketId });
    if (!ticket) throw new BadRequestException('Invalid ticket ID');

    if (ticket.day !== this.dayService.getDay())
      throw new BadRequestException('Ticket expired');

    if (ticket.confirmed) {
      throw new BadRequestException('Ticket already confirmed');
    } else {
      ticket.confirmed = true;
      ticket.save();
      return { status: 'Ticket confirmed sucessfullly!' };
    }
  }

  findAll() {
    return this.ticketModel.find();
  }

  findOne(id: string) {
    return this.ticketModel.findOne({ id });
  }

  getPrice(dni: number, type: TicketType) {
    let price = type === TicketType.vip ? this.VIP_PRICE : this.NORMAL_PRICE;

    if (this.isOndulatedNumber(dni)) price /= 2;

    return price * this.TAX;
  }

  async getMap() {
    await this.checkDay();
    return this.currentSeatMap;
  }

  delete() {
    return this.ticketModel.deleteMany();
  }

  private async checkDay() {
    if (this.currentDay === this.dayService.getDay()) return;

    this.currentDay = this.dayService.getDay();
    this.currentSeatMap.vip = [];
    this.currentSeatMap.general = [];
    await this.initializeSeatsArray();
  }

  private async initializeSeatsArray() {
    const race = await this.raceService.getRaceOfTheDay();
    if (!race)
      throw new InternalServerErrorException(
        'Unexpected: Unable to get race of the day',
      );

    const { general, vip } = race.map;

    for (let i = 0; i != general[0]; ++i) {
      this.currentSeatMap.general.push([]);
      for (let j = 0; j != general[1]; ++j) {
        this.currentSeatMap.general[i][j] = 0;
      }
    }
    for (let i = 0; i != vip[0]; ++i) {
      this.currentSeatMap.vip.push([]);
      for (let j = 0; j != vip[1]; ++j) {
        this.currentSeatMap.vip[i][j] = 0;
      }
    }
  }

  private setSeat({ seatPosition, type }: CreateTicketDto) {
    this.currentSeatMap[type][seatPosition.row][seatPosition.column] = 1;
  }

  private generateId(dni: number, date: number) {
    // TODO: Add logic
    return `${dni}-${date}-race#${this.dayService.getDay()}`;
  }

  private isOndulatedNumber(x: number) {
    // TODO: Add logic
    return x % 2 === 0;
  }

  private isValidSeat({ seatPosition, type }: CreateTicketDto) {
    return (
      seatPosition.row < this.currentSeatMap[type].length &&
      seatPosition.column <
        this.currentSeatMap[type][seatPosition.row].length &&
      this.currentSeatMap[type][seatPosition.row][seatPosition.column] == 0
    );
  }
}
