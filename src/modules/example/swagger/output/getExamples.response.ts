import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  SwaggerResponsePaginationDto,
  SwaggerResponseSuccessDto,
} from '@core/swagger/response/index.response';

export class VGetExamplesPropertyResponse {
  @ApiProperty({ type: String })
  name!: string;

  @ApiPropertyOptional({ type: Number })
  age!: number | null;
}

export class VGetExamplesWithPaginationResponse extends SwaggerResponsePaginationDto {
  @ApiProperty({ type: () => [VGetExamplesPropertyResponse] })
  data!: VGetExamplesPropertyResponse[];
}

export class VGetExamplesResponse extends SwaggerResponseSuccessDto {
  @ApiProperty({ type: () => VGetExamplesWithPaginationResponse })
  data!: VGetExamplesWithPaginationResponse;
}
