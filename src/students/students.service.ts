import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  public constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  public async findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  public async create(student: Student): Promise<Student> {
    return this.studentRepository.save(student);
  }

  public async findById(id: number): Promise<Student | null> {
    return this.studentRepository.findOneBy({ id });
  }

  public async removeById(id: number) {
    return this.studentRepository.delete({ id });
  }
}
