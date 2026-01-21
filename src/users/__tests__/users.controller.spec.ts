import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

import type { TestingModule } from '@nestjs/testing';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const mockCacheManager = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    };

    const mockUsersService = {
      findAll: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      removeById: jest.fn(),
      updateById: jest.fn(),
      transferClasses: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({
        canActivate: jest.fn(() => {
          return true;
        }),
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
