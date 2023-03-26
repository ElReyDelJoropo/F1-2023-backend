import { Controller, Get } from '@nestjs/common';
import { RaceService } from './race.service';

@Controller('race')
export class RaceController {
  constructor(private raceService: RaceService) {}
  @Get()
  findAll() {
    return this.raceService.findAll();
  }
  @Get('/today')
  getRaceOfTheDay() {
    return this.raceService.getRaceOfTheDay();
  }

  @Get('/winners')
  winners() {
    return this.raceService.getWinners();
  }

  @Get('/championship')
  champion() {
    return this.raceService.getWinnerOfChampionship();
  }
}
