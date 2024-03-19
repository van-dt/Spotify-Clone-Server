import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class CompletedPart {
  @IsString()
  @IsNotEmpty()
  ETag: string;

  @IsNumber()
  @IsNotEmpty()
  PartNumber: number;
}

export class VCompleteUploadBody {
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsArray()
  @IsNotEmpty()
  CompletedParts: Array<CompletedPart>;
}
