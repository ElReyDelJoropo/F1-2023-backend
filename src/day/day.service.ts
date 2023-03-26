import { Injectable } from '@nestjs/common';

@Injectable()
export class DayService {
  private day = 1;

  getDay() {
    return this.day;
  }

  nextDay() {
    return ++this.day;
  }

  reset() {
    this.day = 1;
  }
}
