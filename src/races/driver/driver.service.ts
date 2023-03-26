import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { UpdateDriverDto } from '../dto/update-driver.dto';
import {
  Constructor,
  ConstructorDocument,
} from '../schemas/constructor.schema';
import { Driver, DriverDocument } from '../schemas/driver.schema';

@Injectable()
export class DriverService {
  constructor(
    @InjectModel(Driver.name) private driverModel: Model<DriverDocument>,
    @InjectModel(Constructor.name)
    private constructorModel: Model<ConstructorDocument>,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const driverDoc = new this.driverModel(createDriverDto);
    const constructorDoc = await this.constructorModel.findOne({
      id: createDriverDto.team,
    });

    if (!constructorDoc)
      throw new BadRequestException(
        `Team '${createDriverDto.team}' does not exist`,
      );

    const permanentNumberExist = await this.driverModel.findOne({
      permanentNumber: createDriverDto.permanentNumber,
    });

    if (permanentNumberExist)
      throw new BadRequestException(
        `Driver #${createDriverDto.permanentNumber} already exist`,
      );

    constructorDoc.members.push(driverDoc._id);
    await constructorDoc.save();

    return driverDoc.save();
  }

  async findAll() {
    return this.driverModel.find().lean();
  }

  async findOne(id: string) {
    return this.driverModel.findById(id).lean();
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    return this.driverModel.findByIdAndUpdate(id, updateDriverDto).lean();
  }

  async remove(id?: string) {
    return id
      ? this.driverModel.findByIdAndRemove(id).lean()
      : this.driverModel.deleteMany({});
  }
}
