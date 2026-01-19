import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@/guards/jwt.guard';

import type { Request } from 'express';

@Controller('profile')
export class ProfileController {
  @UseGuards(JwtGuard)
  @Get()
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  public profile(@Req() req: Request) {
    const { user } = req;

    if (!user) {
      throw new Error('User not found');
    }

    return `Logged in as ${user.username}`;
  }
}
