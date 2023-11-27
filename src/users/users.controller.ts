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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Req() request: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = request.user.id;
    return this.usersService.updateUser(+userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Req() request: any) {
    const userId = request.user.id;
    return this.usersService.deleteUser(+userId);
  }
}
