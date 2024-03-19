import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { ErrorMessage } from '@core/enum';

export class VSystemLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: ErrorMessage.MAX_LENGTH_255 })
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: ErrorMessage.MIN_LENGTH_8 })
  @MaxLength(255, { message: ErrorMessage.MAX_LENGTH_255 })
  password!: string;
}
