import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Public } from '@core/decorator';
import {
  SwaggerResponseErrorDto,
  SwaggerResponseUnauthorizedDto,
} from '@core/swagger/response/index.response';

import { VCreateExampleDto } from './dto/createExample.dto';
import { VUpdateExampleDto } from './dto/updateExample.dto';
import { ExampleService } from './example.service';
import { VGetExamplesInput } from './swagger/input/getExample.response';
import { VCreateExampleResponse } from './swagger/output/createExample.response';
import { VGetExamplesResponse } from './swagger/output/getExamples.response';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  @ApiBody({ type: VCreateExampleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully created.',

    type: () => VCreateExampleResponse,
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
    type: () => SwaggerResponseErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
    type: () => SwaggerResponseUnauthorizedDto,
  })
  create(@Body() createExampleDto: VCreateExampleDto) {
    return this.exampleService.create(createExampleDto);
  }

  @Public()
  @Get()
  @ApiQuery({ type: VGetExamplesInput })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Response successfully.',
    type: () => VGetExamplesResponse,
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
    type: () => SwaggerResponseErrorDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
    type: () => SwaggerResponseUnauthorizedDto,
  })
  findAll() {
    return this.exampleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExampleDto: VUpdateExampleDto) {
    return this.exampleService.update(+id, updateExampleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exampleService.remove(+id);
  }
}
