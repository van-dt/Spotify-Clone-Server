import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddSongToPlaylistDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  songId!: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  playlistId!: number;
}
