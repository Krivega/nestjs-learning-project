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
} from '@nestjs/common';

import { CreateStudentDto } from './dto/createStudent.dto';
import { UpdateStudentDto } from './dto/updateStudent.dto';
import { Student } from './entities/student.entity';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  public constructor(private readonly studentsService: StudentsService) {}

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
  }
}
