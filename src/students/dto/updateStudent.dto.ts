import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateStudentDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  public name!: string;

  @ApiProperty()
  public id!: number;
}
