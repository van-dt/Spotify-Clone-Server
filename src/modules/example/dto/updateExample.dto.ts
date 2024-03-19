import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsString, MinDate } from 'class-validator';

import { VCreateExampleDto } from './createExample.dto';

export class VUpdateExampleDto extends OmitType(
  VCreateExampleDto,
  [] as const,
) {
  @ApiProperty()
  @IsString()
  test!: number;

  @ApiProperty()
  @IsDate()
  @MinDate(new Date())
  @Type(() => Date)
  test2!: Date;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  test3!: boolean;

  @ApiPropertyOptional()
  @IsString()
  test4?: string | null;
}
