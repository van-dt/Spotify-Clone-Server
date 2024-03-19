import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ErrorMessage } from '@core/enum';

export class SwaggerResponseSuccessDto {
  @ApiProperty({
    default: HttpStatus.OK,
  })
  statusCode!: HttpStatus;

  @ApiProperty()
  data!: unknown;

  @ApiPropertyOptional({ type: String })
  errorMessage!: string | null;

  @ApiProperty({ type: String, default: new Date().toISOString() })
  timestamp!: string;
}

export class SwaggerResponseErrorDto {
  @ApiProperty({
    default: HttpStatus.BAD_REQUEST,
  })
  statusCode!: HttpStatus;

  @ApiProperty({ default: null })
  data!: unknown;

  @ApiProperty({ type: String })
  errorMessage!: string;

  @ApiProperty({ type: String, default: new Date().toISOString() })
  timestamp!: string;
}

export class SwaggerResponseUnauthorizedDto {
  @ApiProperty({
    default: HttpStatus.UNAUTHORIZED,
  })
  statusCode!: HttpStatus;

  @ApiProperty({ default: null })
  data!: unknown;

  @ApiProperty({
    type: String,
    default: ErrorMessage.UNAUTHORIZED.replace(/^error./, ''),
  })
  errorMessage!: string;

  @ApiProperty({ type: String, default: new Date().toISOString() })
  timestamp!: string;
}

export class SwaggerResponseForbiddenDto {
  @ApiProperty({
    default: HttpStatus.FORBIDDEN,
  })
  statusCode!: HttpStatus;

  @ApiProperty({ default: null })
  data!: unknown;

  @ApiProperty({
    type: String,
    default: ErrorMessage.FORBIDDEN.replace(/^error./, ''),
  })
  errorMessage!: string;

  @ApiProperty({ type: String, default: new Date().toISOString() })
  timestamp!: string;
}

export class SwaggerResponsePaginationDto {
  @ApiProperty({
    type: Number,
  })
  page!: number;

  @ApiProperty({
    type: Number,
  })
  take!: number;

  @ApiProperty({
    type: Number,
  })
  skip!: number;
}
