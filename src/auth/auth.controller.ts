import {
  BadRequestException,
  Body,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const credentials = await this.authService.login(authDto);
    if (!credentials)
      throw new BadRequestException('Invalid username or password');
    return credentials;
  }

  @Post('register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const newUser = await this.authService.register(createUserDto);

    if (!newUser) throw new BadRequestException('User already exist');

    return newUser;
  }
}
