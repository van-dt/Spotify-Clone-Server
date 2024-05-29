import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAuthorLikeDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  authorId!: number;
}
