import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';

import { StudentsController } from '../students.controller';
import { StudentsService } from '../students.service';

import type { TestingModule } from '@nestjs/testing';

describe('StudentsController', () => {
  let controller: StudentsController;

  beforeEach(async () => {
    const mockCacheManager = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    };

    const mockStudentsService = {
      findAll: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      removeById: jest.fn(),
      updateById: jest.fn(),
      transferClasses: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: StudentsService,
          useValue: mockStudentsService,
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

    controller = module.get<StudentsController>(StudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
