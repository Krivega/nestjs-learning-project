import { Contains, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Length(10, 20)
  name!: string;

  @Column()
  @Contains('hello')
  about!: string;
}
