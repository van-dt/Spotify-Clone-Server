import { IsString, IsArray, ArrayMinSize, ArrayUnique } from 'class-validator';

export class VDeleteBody {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  urls: Array<string>;
}
