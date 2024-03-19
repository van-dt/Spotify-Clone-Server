import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '@core/decorator';
import { AuthService } from '@core/global/auth/auth.service';
import { VSystemLoginDto } from '@core/global/auth/dto/systemLogin.dto';
import { VSignUpDto } from '@core/global/auth/dto/systemSignUp.dto';
import { VLoginResponse } from '@core/global/auth/swagger/output/systemLogin.response';
import { VSignUpResponse } from '@core/global/auth/swagger/output/systemSignUp.response';
import { SwaggerResponseErrorDto } from '@core/swagger/response/index.response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiBody({ type: VSystemLoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Response successfully.',

    type: () => VLoginResponse,
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
    type: () => SwaggerResponseErrorDto,
  })
  async systemLogin(@Body() body: VSystemLoginDto) {
    return await this.authService.login(body);
  }

  @Public()
  @Post('/sign-up')
  @ApiBody({ type: VSignUpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',

    type: () => VSignUpResponse,
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
    type: () => SwaggerResponseErrorDto,
  })
  async signUp(@Body() body: VSignUpDto) {
    return this.authService.signUp(body);
  }
}
