import { ApiProperty } from '@nestjs/swagger';

import { SwaggerInputPaginationDto } from '@core/swagger/dto/index.swagger';

export class VGetExamplesInput extends SwaggerInputPaginationDto {
  @ApiProperty({ type: String })
  search!: string;
}
