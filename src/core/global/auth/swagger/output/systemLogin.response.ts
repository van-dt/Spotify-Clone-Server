import { ApiProperty } from '@nestjs/swagger';

import { SwaggerResponseSuccessDto } from '@core/swagger/response/index.response';

export class VSystemLoginResponse {
  @ApiProperty({ type: String })
  token!: string;
}
export class VLoginResponse extends SwaggerResponseSuccessDto {
  @ApiProperty({ type: VSystemLoginResponse })
  data!: VSystemLoginResponse;
}
