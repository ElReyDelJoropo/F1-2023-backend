import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateConstructorDto } from '../dto/create-constructor.dto';
import { UpdateConstructorDto } from '../dto/update-race.dto';
import { ConstructorService } from './constructor.service';

@Controller('constructor')
export class ConstructorController {
  constructor(private readonly constructorService: ConstructorService) {}

  @Get()
  findAll() {
    return this.constructorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.constructorService.findOne(id);
  }

  @Post()
  create(
    @Body(new ValidationPipe()) createConstructorDto: CreateConstructorDto,
  ) {
    return this.constructorService.create(createConstructorDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateDriverDto: UpdateConstructorDto,
  ) {
    return this.constructorService.update(id, updateDriverDto);
  }
}
