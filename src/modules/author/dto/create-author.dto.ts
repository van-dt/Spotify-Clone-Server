import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { ErrorMessage } from '../../../core/enum';

export class CreateAuthorDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: ErrorMessage.MAX_LENGTH_255 })
  authorName!: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  image?: string;
}
