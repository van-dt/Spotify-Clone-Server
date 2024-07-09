import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

import { ErrorMessage } from '../../../core/enum';

export class UpdateUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: ErrorMessage.MAX_LENGTH_255 })
  fullName?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: ErrorMessage.MAX_LENGTH_255 })
  bio?: string;
}
