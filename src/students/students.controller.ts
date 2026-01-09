import { Controller, Get } from '@nestjs/common';

import { Student } from './entities/student.entity';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  public constructor(private readonly studentsService: StudentsService) {}

  @Get()
  public async findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }
}
