import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { DayService } from './day/day.service';
import { RaceService } from './races/race/race.service';

@Controller()
export class AppController {
  constructor(
    private readonly dayService: DayService,
    private readonly raceService: RaceService,
  ) {}

  @Get('/day')
  getDay() {
    return {
      day: this.dayService.getDay(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/day/reset')
  reset() {
    return this.dayService.reset();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/day/next')
  async next() {
    await this.raceService.defineWinnersOfTheDay();
    return { day: this.dayService.nextDay() };
  }
}
