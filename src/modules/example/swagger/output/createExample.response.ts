import { ApiProperty } from '@nestjs/swagger';

import { SwaggerResponseSuccessDto } from '@core/swagger/response/index.response';

import { VCreateExampleDto } from '../../dto/createExample.dto';

export class VCreateExampleResponse extends SwaggerResponseSuccessDto {
  @ApiProperty({ type: VCreateExampleDto })
  data!: VCreateExampleDto;
}
