import { PartialType } from '@nestjs/mapped-types';
import { CreateConstructorDto } from './create-constructor.dto';

export class UpdateConstructorDto extends PartialType(CreateConstructorDto) {}
