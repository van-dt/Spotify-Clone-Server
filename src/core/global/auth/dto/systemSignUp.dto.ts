import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsArray,
} from 'class-validator';

import { ErrorMessage } from '@core/enum';

export class VSignUpDto {
  @ApiProperty()
  @IsString()
  @IsEmail({}, { message: ErrorMessage.EMAIL_FORMAT })
  @IsNotEmpty()
  @MaxLength(255, { message: ErrorMessage.MAX_LENGTH_255 })
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: ErrorMessage.MIN_LENGTH_8 })
  @MaxLength(255, { message: ErrorMessage.MAX_LENGTH_255 })
  password!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: ErrorMessage.MAX_LENGTH_255 })
  fullName!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
