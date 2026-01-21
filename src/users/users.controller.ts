import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  NotFoundException,
  Patch,
  Inject,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { UsersService } from './users.service';

import type { Cache as TCacheManager } from '@nestjs/cache-manager';
import type { CreateUserDto } from './dto/createUser.dto';
import type { TransferBalanceDto } from './dto/transferBalance.dto';
import type { UpdateUserDto } from './dto/updateUser.dto';
import type { User } from './entities/user.entity';

const getCacheKey = (id: number) => {
  return `users:${id}`;
};

const ALL_CACHE_KEY = 'all_users';

@Controller('users')
@UseGuards(ThrottlerGuard)
@UseInterceptors(CacheInterceptor)
export class UsersController {
  public constructor(
    @Inject(CACHE_MANAGER) private readonly cache: TCacheManager,
    private readonly usersService: UsersService,
  ) {}

  @CacheKey(ALL_CACHE_KEY)
  @CacheTTL(50)
  @Get()
  @Get()
  public async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  public async create(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.create(user);
  }

  @Delete(':id')
  public async removeById(@Param('id', ParseIntPipe) id: number) {
    const isExist = await this.usersService.findById(id);

    if (isExist === null) {
      throw new NotFoundException();
    }

    await this.usersService.removeById(id);
    await this.invalidateCache(id);
  }

  @Get(':id')
  public async findById(@Param('id') id: number) {
    const cacheKey = getCacheKey(id);

    const cachedUser = await this.cache.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.usersService.findById(id);

    await this.cache.set(cacheKey, user);

    return user;
  }

  @Patch(':id')
  public async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ) {
    const isExist = await this.usersService.findById(id);

    if (isExist === null) {
      throw new NotFoundException();
    }

    await this.usersService.updateById(id, user);
    await this.invalidateCache(id);
  }

  @Post('transfer')
  public async transfer(
    @Body() transferData: TransferBalanceDto,
  ): Promise<boolean> {
    const { from, to, amount } = transferData;
    const fromUser = await this.usersService.findById(from);
    const toUser = await this.usersService.findById(to);

    if (fromUser === null || toUser === null) {
      throw new NotFoundException();
    }

    return this.usersService.transferClasses(fromUser, toUser, amount);
  }

  private async invalidateCache(id: number) {
    const cacheKey = getCacheKey(id);

    await this.cache.del(ALL_CACHE_KEY);
    await this.cache.del(cacheKey);
  }
}
