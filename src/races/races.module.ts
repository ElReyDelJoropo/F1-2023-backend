import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DayModule } from 'src/day/day.module';
import { RestaurantsModule } from 'src/restaurant/restaurant.module';
import { ConstructorController } from './constructor/constructor.controller';
import { ConstructorService } from './constructor/constructor.service';
import { DriverController } from './driver/driver.controller';
import { DriverService } from './driver/driver.service';
import { RaceController } from './race/race.controller';
import { RaceService } from './race/race.service';
import { Constructor, ConstructorSchema } from './schemas/constructor.schema';
import { Driver, DriverSchema } from './schemas/driver.schema';
import { Race, RaceSchema } from './schemas/race.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema },
      { name: Constructor.name, schema: ConstructorSchema },
      { name: Race.name, schema: RaceSchema },
    ]),
    RestaurantsModule,
    DayModule,
  ],
  controllers: [ConstructorController, DriverController, RaceController],
  providers: [ConstructorService, DriverService, RaceService],
  exports: [MongooseModule, ConstructorService, DriverService, RaceService],
})
export class RacesModule {}
