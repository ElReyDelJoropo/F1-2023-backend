import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isArray } from 'class-validator';
import { Model } from 'mongoose';
import { CreateConstructorDto } from '../dto/create-constructor.dto';
import { UpdateDriverDto } from '../dto/update-driver.dto';
import {
  Constructor,
  ConstructorDocument,
} from '../schemas/constructor.schema';

@Injectable()
export class ConstructorService {
  constructor(
    @InjectModel(Constructor.name)
    private constructorModel: Model<ConstructorDocument>,
  ) {}

  async create(
    createConstructorDto: CreateConstructorDto | CreateConstructorDto[],
  ) {
    const exist = isArray(createConstructorDto)
      ? await this.constructorModel.findOne({
          id: {
            $in: createConstructorDto.map((constructor) => constructor.id),
          },
        })
      : await this.constructorModel.findOne({ id: createConstructorDto.id });

    if (exist)
      throw new BadRequestException(`Team id '${exist.id}' already exist`);

    return this.constructorModel.create(createConstructorDto);
  }

  async findAll() {
    return this.constructorModel.find().lean().populate('members');
  }

  async findOne(id: string) {
    return this.constructorModel.findOne({ id }).lean();
  }

  async update(id: string, updateConstructorDto: UpdateDriverDto) {
    return this.constructorModel
      .findByIdAndUpdate(id, updateConstructorDto)
      .lean();
  }

  async remove(id?: string) {
    return id
      ? this.constructorModel.findByIdAndRemove(id).lean()
      : this.constructorModel.deleteMany({});
  }
}
