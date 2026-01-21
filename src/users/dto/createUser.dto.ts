import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  about!: string;

  @ApiProperty()
  balance!: number;
}
