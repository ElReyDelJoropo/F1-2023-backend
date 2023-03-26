import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const adminCredentials = configService.get('admin');
    this.register({
      ...adminCredentials,
      age: 69,
    });
  }

  async login(authDto: AuthDto) {
    const user = await this.validateUser(authDto);

    if (!user) return null;

    const payload = { sub: authDto.dni };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const exist = await this.userService.findBy({ dni: createUserDto.dni });

    if (exist) return null;

    return this.userService.create(createUserDto);
  }

  async validateUser({ dni, password }: AuthDto) {
    const user = await this.userService.findBy({ dni });

    if (user && user.password === password) return user;
    else return null;
  }
}
