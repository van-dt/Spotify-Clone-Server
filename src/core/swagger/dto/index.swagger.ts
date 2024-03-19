import { ApiPropertyOptional } from '@nestjs/swagger';

export class SwaggerInputPaginationDto {
  @ApiPropertyOptional({ type: Number })
  page!: number;

  @ApiPropertyOptional({ type: Number })
  limit!: number;
}
