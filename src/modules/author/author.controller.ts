import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { Roles } from '../../core/decorator';
import { ERole } from '../../core/enum';

import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import {
  FindAllAuthorFilterDto,
  FindAllAuthorFilterParams,
} from './dto/find-author.dto';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Roles([ERole.USER])
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  findAll(@FindAllAuthorFilterParams() filter: FindAllAuthorFilterDto) {
    return this.authorService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(+id);
  }
}
