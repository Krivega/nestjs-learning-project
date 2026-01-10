/* eslint-disable no-param-reassign */
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DataSource, Repository } from 'typeorm';
import { Logger } from 'winston';

import { CreateStudentDto } from './dto/createStudent.dto';
import { UpdateStudentDto } from './dto/updateStudent.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly dataSource: DataSource,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  public async findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  public async create(student: CreateStudentDto): Promise<Student> {
    return this.studentRepository.save(student);
  }

  public async findById(id: number): Promise<Student | null> {
    return this.studentRepository.findOneBy({ id });
  }

  public async removeById(id: number) {
    return this.studentRepository.delete({ id });
  }

  public async updateById(id: number, updateStudentDto: UpdateStudentDto) {
    return this.studentRepository.update({ id }, updateStudentDto);
  }

  public async transferClasses(
    sender: Student,
    receiver: Student,
    amount: number,
  ): Promise<boolean> {
    // Валидация входных данных
    if (amount <= 0) {
      this.logger.error(`Некорректная сумма перевода: ${amount}`);

      return false;
    }

    if (sender.balance < amount) {
      this.logger.error(
        `Недостаточно средств у отправителя ${sender.name}. Текущий баланс: ${sender.balance}, требуется: ${amount}`,
      );

      return false;
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    this.logger.debug('Состояние до операции');
    this.logger.debug(`Баланс отправителя ${sender.name} - ${sender.balance}`);
    this.logger.debug(
      `Баланс получателя ${receiver.name} - ${receiver.balance}`,
    );
    this.logger.debug(
      `Пытаемся перевести ${amount} от ${sender.name} к ${receiver.name}`,
    );

    try {
      // Исправлена логика перевода: отправитель отдает, получатель получает
      sender.balance -= amount;
      receiver.balance += amount;
      this.logger.debug('Сохраняем изменения в БД');
      // Используем queryRunner.manager для работы в рамках транзакции
      await queryRunner.manager.save(sender);
      await queryRunner.manager.save(receiver);
      this.logger.debug(
        'Операция произошла успешно. Текущее состояние балансов',
      );
      this.logger.debug(
        `Баланс отправителя ${sender.name} - ${sender.balance}`,
      );
      this.logger.debug(
        `Баланс получателя ${receiver.name} - ${receiver.balance}`,
      );

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      this.logger.error(
        `В процессе операции возникла ошибка ${(error as Error).message}`,
      );

      await queryRunner.rollbackTransaction();

      return false;
    } finally {
      await queryRunner.release();
    }
  }
}
