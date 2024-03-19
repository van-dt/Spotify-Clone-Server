import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

class SnsDto {
  @IsString()
  Message: string;
}

class RecordsDto {
  @ValidateNested()
  @Type(() => SnsDto)
  Sns: SnsDto;
}

export class VSesWebhookDto {
  @IsArray()
  @ValidateNested()
  @Type(() => RecordsDto)
  Records: RecordsDto[];
}
