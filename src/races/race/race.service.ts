import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DayService } from 'src/day/day.service';
import {
  Restaurant,
  RestaurantDocument,
} from 'src/restaurant/schemas/restaurant.schema';
import { DriverService } from '../driver/driver.service';
import { CreateRaceDto } from '../dto/create-race.dto';
import { Race, RaceDocument } from '../schemas/race.schema';

@Injectable()
export class RaceService {
  private readonly scores = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  constructor(
    @InjectModel(Race.name) private raceModel: Model<RaceDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    private readonly dayService: DayService,
    private readonly driverService: DriverService,
  ) {}

  async create(createRaceDto: CreateRaceDto) {
    const { restaurants, ...race } = createRaceDto;
    const restaurantDocs = await this.restaurantModel.create(restaurants);
    const restaurantsIds = restaurantDocs.map((doc) => doc._id);

    return this.raceModel.create({ restaurants: restaurantsIds, ...race });
  }

  bulkCreate(createRaceDto: CreateRaceDto[]) {
    const ret = [];
    for (const race of createRaceDto) ret.push(this.create(race));
    return Promise.all(ret);
  }

  find(id: string) {
    return this.raceModel.findById(id).exec();
  }

  findAll() {
    return this.raceModel.find({}).sort('round').exec();
  }

  getRaceOfTheDay() {
    return this.raceModel
      .findOne({ round: this.dayService.getDay() })
      .populate('restaurants')
      .exec();
  }

  async defineWinnersOfTheDay() {
    const drivers = await this.driverService.findAll();
    const todayRace = await this.getRaceOfTheDay();
    if (!todayRace)
      throw new InternalServerErrorException(
        'Unexpected error: Today race not found',
      );

    if (drivers.length < 10)
      throw new InternalServerErrorException(
        'Unexpected error: # of drivers is less than 10!',
      );

    todayRace.podium = drivers
      .map((driver) => driver._id)
      .sort(() => Math.random() - 0.5)
      .slice(10);
    return todayRace.save();
  }

  async getWinners() {
    return this.raceModel
      .find()
      .populate('podium')
      .sort('round')
      .select('podium')
      .exec();
  }

  //Ugly, but works
  async getWinnerOfChampionship() {
    const races = await this.getWinners();
    const drivers = await this.driverService.findAll();

    //Could be improved using Map or hashtable
    const driverScoreMap: { driverId: Types.ObjectId; score: number }[] = [];
    const constructorScoreMap: { constructorId: string; score: number }[] = [];

    for (const race of races) {
      for (let i = 0; i != race.podium.length; ++i) {
        const driver = drivers.find((d) => d._id.equals(race.podium[i]._id));
        //For debugging purposes
        if (!driver)
          throw new InternalServerErrorException(
            'Unexpected: driver is undefined',
          );

        const driverIndex = driverScoreMap.findIndex((p) =>
          p.driverId.equals(driver._id),
        );
        if (driverIndex == -1)
          driverScoreMap.push({
            driverId: driver._id,
            score: this.scores[i],
          });
        else driverScoreMap[driverIndex].score += this.scores[i];

        const constructorIndex = constructorScoreMap.findIndex(
          (p) => p.constructorId === driver.team,
        );
        if (constructorIndex == -1)
          constructorScoreMap.push({
            constructorId: driver.team,
            score: this.scores[i],
          });
        else constructorScoreMap[constructorIndex].score += this.scores[i];
      }
    }

    const winner = driverScoreMap
      .sort((lhs, rhs) => lhs.score - rhs.score)
      .pop();

    if (!winner)
      throw new InternalServerErrorException(
        'Unexpected: winner array is empty',
      );

    const constructorWinner = constructorScoreMap
      .sort((lhs, rhs) => lhs.score - rhs.score)
      .pop();

    if (!winner)
      throw new InternalServerErrorException(
        'Unexpected: winner array is empty',
      );

    return {
      driver: winner,
      constructor: constructorWinner,
    };
  }

  remove(id?: string) {
    return id
      ? this.raceModel.findByIdAndRemove(id).lean().exec()
      : this.raceModel.deleteMany({}).exec();
  }
}
