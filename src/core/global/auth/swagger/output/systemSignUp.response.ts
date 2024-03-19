import { ApiProperty } from '@nestjs/swagger';

import { SwaggerResponseSuccessDto } from '@core/swagger/response/index.response';

export class VSignUpResponse extends SwaggerResponseSuccessDto {
  @ApiProperty({ type: Boolean })
  data!: boolean;
}
