import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public auth(user: { id: string }) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  public async validatePassword({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const user = await this.usersService.findByUsername(username);

    /* В идеальном случае пароль обязательно должен быть захэширован */
    if (user?.password === password) {
      /* Исключаем пароль из результата */
      const { password: passwordRemoved, ...result } = user;

      return result;
    }

    return undefined;
  }
}
