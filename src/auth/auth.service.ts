import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '@/users/users.service';

import type { Profile } from 'passport-yandex';

@Injectable()
export class AuthService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public auth(user: { id: number }) {
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
      return user;
    }

    return undefined;
  }

  public async validateFromYandex(profile: Profile) {
    const email = profile.emails?.[0]?.value;

    if (email === undefined) {
      return undefined;
    }

    const user = await this.usersService.findByEmail(email);

    /* Если пользователь не найден, создадим его */
    if (!user) {
      return this.usersService.createFromYandex({ email });
    }

    return user;
  }
}
