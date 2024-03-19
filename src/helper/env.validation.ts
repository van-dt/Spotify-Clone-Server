import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
  validateSync,
} from 'class-validator';

import { EEnvironment } from '@core/enum';

class EnvironmentVariables {
  @IsString()
  TZ: string;

  @IsEnum(EEnvironment)
  NODE_ENV: EEnvironment;

  @IsNumber()
  PORT: number;

  @IsString()
  SECRET_KEY_REFRESH_TOKEN: string;

  @IsString()
  SECRET_KEY: string;

  @IsNumberString()
  EXPIRE_TOKEN: string | number;

  @IsNumberString()
  EXPIRE_REFRESH_TOKEN: string | number;

  @IsString()
  CLIENT_URL: string;

  @IsNumberString()
  EXPIRE_VALIDATION_TOKEN_URL: string | number;

  @IsString()
  SECRET_KEY_VALIDATION_TOKEN_URL: string;

  @IsString()
  RSA_PRIVATE_KEY: string;

  @IsString()
  RSA_PUBLIC_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
