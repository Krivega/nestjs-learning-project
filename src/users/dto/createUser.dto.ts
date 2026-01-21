import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  username!: string;

  @ApiProperty()
  about!: string;

  @ApiProperty()
  balance!: number;

  @ApiProperty()
  password!: string;
}
