import { IsString, MinLength } from 'class-validator';

export class UpdateStudentDto {
  @IsString()
  @MinLength(1)
  public name!: string;

  public id!: number;
}
