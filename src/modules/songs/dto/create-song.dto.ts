import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { ErrorMessage } from '../../../core/enum';

export class CreateSongDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: ErrorMessage.MAX_LENGTH_255 })
  title!: string;

  @ApiProperty({ type: String })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  songPath!: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  imagePath?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  author!: string;

  // @ApiProperty({ type: Number })
  // @IsNumber()
  // @IsNotEmpty()
  // userId!: number;
}
