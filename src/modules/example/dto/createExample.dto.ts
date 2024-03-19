import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinDate,
  ValidateNested,
} from 'class-validator';

import { EDisplayStatus, ErrorMessage } from '@core/enum';

export class VCreateExampleSubDto {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: ErrorMessage.MAX_LENGTH_100 })
  mTempleSettingAnniversaryTypeTitle?: string | null;
}

export class VCreateExampleSub2Dto {
  @ApiProperty()
  @IsNumber()
  id!: number;

  @ApiProperty()
  @IsNumber()
  amount!: number;
}

export class VCreateExampleDto {
  @ApiProperty()
  @IsString()
  name!: number;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNumber()
  age!: number;

  @ApiProperty()
  @IsDate()
  @MinDate(new Date())
  @Type(() => Date)
  birthday!: Date;

  @ApiProperty({
    required: false,
    enum: EDisplayStatus,
    enumName: 'EDisplayStatus',
  })
  @IsOptional()
  @IsEnum(EDisplayStatus)
  gender?: EDisplayStatus | null;

  @ApiProperty()
  @IsString()
  @MaxLength(100, { message: ErrorMessage.MAX_LENGTH_100 })
  description!: string;

  @ApiProperty({ type: [VCreateExampleSubDto], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1)
  @ValidateNested({ each: true })
  @Type(() => VCreateExampleSubDto)
  sub1?: VCreateExampleSubDto[] | null;

  @ApiProperty({ type: VCreateExampleSub2Dto })
  @ValidateNested()
  @Type(() => VCreateExampleSub2Dto)
  sub2!: VCreateExampleSub2Dto;
}
