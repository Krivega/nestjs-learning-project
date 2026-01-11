import { CACHE_MANAGER } from '@nestjs/cache-manager';
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
} from '@nestjs/common';

import { StudentsService } from './students.service';

import type { Cache as TCacheManager } from '@nestjs/cache-manager';
import type { CreateStudentDto } from './dto/createStudent.dto';
import type { TransferBalanceDto } from './dto/transferBalance.dto';
import type { UpdateStudentDto } from './dto/updateStudent.dto';
import type { Student } from './entities/student.entity';

const getCacheKey = (id: number) => {
  return `users:${id}`;
};

@Controller('students')
export class StudentsController {
  public constructor(
    @Inject(CACHE_MANAGER) private readonly cache: TCacheManager,
    private readonly studentsService: StudentsService,
  ) {}

  @Get()
  public async findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Post()
  public async create(@Body() student: CreateStudentDto): Promise<Student> {
    return this.studentsService.create(student);
  }

  @Delete(':id')
  public async removeById(@Param('id', ParseIntPipe) id: number) {
    const isExist = await this.studentsService.findById(id);

    if (isExist === null) {
      throw new NotFoundException();
    }

    await this.studentsService.removeById(id);
    await this.invalidateCache(id);
  }

  @Get(':id')
  public async findById(@Param('id') id: number) {
    const cacheKey = getCacheKey(id);

    const cachedStudent = await this.cache.get<Student>(cacheKey);

    if (cachedStudent) {
      return cachedStudent;
    }

    const student = await this.studentsService.findById(id);

    await this.cache.set(cacheKey, student);

    return student;
  }

  @Patch(':id')
  public async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() student: UpdateStudentDto,
  ) {
    const isExist = await this.studentsService.findById(id);

    if (isExist === null) {
      throw new NotFoundException();
    }

    await this.studentsService.updateById(id, student);
    await this.invalidateCache(id);
  }

  @Post('transfer')
  public async transfer(
    @Body() transferData: TransferBalanceDto,
  ): Promise<boolean> {
    const { from, to, amount } = transferData;
    const fromStudent = await this.studentsService.findById(from);
    const toStudent = await this.studentsService.findById(to);

    if (fromStudent === null || toStudent === null) {
      throw new NotFoundException();
    }

    return this.studentsService.transferClasses(fromStudent, toStudent, amount);
  }

  private async invalidateCache(id: number) {
    const cacheKey = getCacheKey(id);

    return this.cache.del(cacheKey);
  }
}
