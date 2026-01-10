import { ApiProperty } from '@nestjs/swagger';

export class TransferBalanceDto {
  @ApiProperty()
  from!: number;

  @ApiProperty()
  to!: number;

  @ApiProperty()
  amount!: number;
}
