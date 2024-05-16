import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSongLikeDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  songId!: number;
}
