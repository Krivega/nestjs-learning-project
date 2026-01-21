import { ApiProperty } from '@nestjs/swagger';

export class TransferBalanceDto {
  @ApiProperty()
  from!: string;

  @ApiProperty()
  to!: string;

  @ApiProperty()
  amount!: number;
}
