import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { Roles, UserData } from '../../core/decorator';
import { ERole } from '../../core/enum';
import { IUserData } from '../../core/interface';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles([ERole.USER])
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles([ERole.USER])
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Roles([ERole.USER])
  @Get('/my')
  getMyProfile(@UserData() user: IUserData) {
    return this.usersService.getMyProfile(user.uid);
  }

  @Roles([ERole.USER])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Roles([ERole.USER])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles([ERole.USER])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
