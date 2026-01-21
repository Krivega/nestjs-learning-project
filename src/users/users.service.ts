/* eslint-disable no-param-reassign */
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Repository, DataSource } from 'typeorm';
import { Logger } from 'winston';

import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(user);
  }

  public async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  public async findById(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    return user;
  }

  public async findByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });

    return user;
  }

  public async removeById(id: string) {
    return this.usersRepository.delete({ id });
  }

  public async updateById(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ id }, updateUserDto);
  }

  public async transferClasses(
    sender: User,
    receiver: User,
    amount: number,
  ): Promise<boolean> {
    // Валидация входных данных
    if (amount <= 0) {
      this.logger.error(`Некорректная сумма перевода: ${amount}`);

      return false;
    }

    if (sender.balance < amount) {
      this.logger.error(
        `Недостаточно средств у отправителя ${sender.username}. Текущий баланс: ${sender.balance}, требуется: ${amount}`,
      );

      return false;
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    this.logger.debug('Состояние до операции');
    this.logger.debug(
      `Баланс отправителя ${sender.username} - ${sender.balance}`,
    );
    this.logger.debug(
      `Баланс получателя ${receiver.username} - ${receiver.balance}`,
    );
    this.logger.debug(
      `Пытаемся перевести ${amount} от ${sender.username} к ${receiver.username}`,
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
        `Баланс отправителя ${sender.username} - ${sender.balance}`,
      );
      this.logger.debug(
        `Баланс получателя ${receiver.username} - ${receiver.balance}`,
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
