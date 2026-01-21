import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  public name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  public about!: string;

  @ApiProperty()
  public id!: number;
}
