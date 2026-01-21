/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-yandex';

import { AuthService } from './auth.service';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    /* В конструктор родителя мы можем передать параметры для стратегии */
    super({
      clientID: configService.get<string>('YANDEX_CLIENT_ID')!,
      clientSecret: configService.get<string>('YANDEX_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('YANDEX_REDIRECT_URI')!,
    });
  }

  public async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const user = await this.authService.validateFromYandex(profile);

    if (!user) {
      throw new UnauthorizedException();
    }

    /* Исключаем пароль из результата по соображениям безопасности */
    const { password, ...result } = user;

    return result;
  }
}
