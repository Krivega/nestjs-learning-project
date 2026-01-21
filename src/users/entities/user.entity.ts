import {
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: ['local', 'oauth'], default: 'local' })
  @IsOptional()
  @IsEnum(['local', 'oauth'])
  authType: 'local' | 'oauth' = 'local';

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  about?: string;

  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  balance = 0;
}
