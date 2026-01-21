import {
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: 'enum', enum: ['local', 'oauth'], default: 'local' })
  authType: 'local' | 'oauth' = 'local';

  @Column()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @Column()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Column()
  @IsOptional()
  about?: string;

  @Column()
  @IsInt()
  @Min(0)
  balance!: number;
}
