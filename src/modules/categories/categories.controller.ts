import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { Roles } from '../../core/decorator';
import { ERole } from '../../core/enum';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  FindAllCategoryFilterDto,
  FindAllCategoryFilterParams,
} from './dto/find-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles([ERole.USER])
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@FindAllCategoryFilterParams() filter: FindAllCategoryFilterDto) {
    return this.categoriesService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
