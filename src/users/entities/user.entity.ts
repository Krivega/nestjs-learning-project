import { IsInt, Min, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @Column()
  about!: string;

  @Column()
  @IsInt()
  @Min(0)
  balance!: number;
}
