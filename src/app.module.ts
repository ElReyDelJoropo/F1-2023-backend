import { HttpModule, HttpService } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import configuration, { envSchema } from './configuration';
import { ConstructorService } from './races/constructor/constructor.service';
import { DriverService } from './races/driver/driver.service';
import { CreateConstructorDto } from './races/dto/create-constructor.dto';
import { CreateDriverDto } from './races/dto/create-driver.dto';
import { CreateRaceDto } from './races/dto/create-race.dto';
import { RaceService } from './races/race/race.service';
import { RacesModule } from './races/races.module';
import { RestaurantsModule } from './restaurant/restaurant.module';
import { RestaurantService } from './restaurant/restaurant.service';
import { UserModule } from './user/user.module';
import { TicketModule } from './ticket/ticket.module';
import { DayModule } from './day/day.module';

@Module({
  imports: [
    RacesModule,
    RestaurantsModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envSchema,
      validationOptions: {
        allowUnknow: false,
        abortEarly: false,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    TicketModule,
    DayModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  private readonly logger = new Logger('Race Module');
  constructor(
    private readonly constructorService: ConstructorService,
    private readonly driverService: DriverService,
    private readonly raceService: RaceService,
    private readonly restaurantService: RestaurantService,
    private readonly httpService: HttpService,
  ) {
    // this.wipeDatabase().then(() =>
    //   this.getData().then(([constructors, drivers]) => {
    //     this.constructorService.create(constructors).then(() => {
    //       drivers.forEach((driver) => this.driverService.create(driver));
    //     });
    //   }),
    // );
    this.wipeDatabase()
      .then(() => this.getData())
      .then(([constructors, drivers, races]) => {
        this.constructorService
          .create(constructors)
          .then(() =>
            drivers.forEach((driver) => this.driverService.create(driver)),
          );
        this.raceService.bulkCreate(races);
      });
  }

  getData() {
    return Promise.all([
      this.fetchFromApi<CreateConstructorDto[]>(
        'https://raw.githubusercontent.com/Algorimtos-y-Programacion-2223-2/api-proyecto/main/constructors.json',
      ),
      this.fetchFromApi<CreateDriverDto[]>(
        'https://raw.githubusercontent.com/Algorimtos-y-Programacion-2223-2/api-proyecto/main/drivers.json',
      ),
      this.fetchFromApi<CreateRaceDto[]>(
        'https://raw.githubusercontent.com/Algorimtos-y-Programacion-2223-2/api-proyecto/main/races.json',
      ),
    ]);
  }

  wipeDatabase() {
    return Promise.all([
      this.constructorService.remove(),
      this.driverService.remove(),
      this.restaurantService.remove(),
      this.raceService.remove(),
    ]);
  }

  async fetchFromApi<T>(url: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<T>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response?.data);
          throw new Error('Unexpected error happened');
        }),
      ),
    );
    return data;
  }
}
