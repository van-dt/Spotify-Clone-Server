import { IsOptional, IsString } from 'class-validator';

export class VUploadBody {
  @IsOptional()
  @IsString()
  unGenerateName?: string | null;
}
