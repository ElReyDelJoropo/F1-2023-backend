import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
  ParseEnumPipe,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto, TicketType } from './dto/create-ticket.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @User('dni', ParseIntPipe) dni: number,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    const ticket = await this.ticketService.create(dni, createTicketDto);
    if (ticket) return ticket;
    else throw new BadRequestException('Invalid ticket');
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/price')
  getPrice(
    @User('dni', ParseIntPipe) dni: number,
    @Query('type', new ParseEnumPipe(TicketType)) type: TicketType,
  ) {
    return { price: this.ticketService.getPrice(dni, type) };
  }

  @Get('/map')
  getMap() {
    return this.ticketService.getMap();
  }

  @Post('/confirm')
  confirm(@Body('id') id: string) {
    return this.ticketService.confirm(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteAll() {
    return this.ticketService.delete();
  }
}
