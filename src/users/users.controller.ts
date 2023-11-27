import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Render,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Render('register')
  registerPage() {
    return {};
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    await this.usersService.create(createUserDto);
    response.redirect('/auth')
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Req() request: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = request.user.id;
    return this.usersService.updateUser(+userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@Req() request: any) {
    const userId = request.user.useidrId;
    return this.usersService.deleteUser(+userId);
  }
}
