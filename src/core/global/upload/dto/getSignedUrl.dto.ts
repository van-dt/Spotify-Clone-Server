import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VPreSignedUrlsBody {
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsNumber()
  @IsNotEmpty()
  partNumber: number;
}
