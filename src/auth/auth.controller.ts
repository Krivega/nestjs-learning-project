import {
  Controller,
  Body,
  Post,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { LocalGuard } from '@/guards/local.guard';
import { CreateUserDto } from '@/users/dto/createUser.dto';
import { UsersService } from '@/users/users.service';
import { AuthService } from './auth.service';

import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Стратегия local автоматически достанет username и password из тела запроса
   * Если пароль будет верным, данные пользователя окажутся в объекте req.user
   */
  @UseGuards(LocalGuard)
  @Post('signin')
  public signin(@Req() req: Request) {
    const { user } = req;

    if (!user) {
      throw new UnauthorizedException();
    }

    /* Генерируем для пользователя JWT-токен */
    return this.authService.auth(user);
  }

  @Post('signup')
  public async signup(@Body() createUserDto: CreateUserDto) {
    /* При регистрации создаём пользователя и генерируем для него токен */
    const user = await this.usersService.create(createUserDto);

    return this.authService.auth(user);
  }
}
