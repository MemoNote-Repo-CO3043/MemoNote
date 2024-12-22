import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: CreateUserDto })
  @Post('/login')
  login(@Body() createUserDto: CreateUserDto) {
    try {
      return this.userService.login(
        createUserDto.username,
        createUserDto.password,
      );
    } catch (e) {
      return {
        statusCode: e.statusCode,
        message: e.message,
      };
    }
  }
  @ApiBody({ type: CreateUserDto })
  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    try {
      return this.userService.register(
        createUserDto.username,
        createUserDto.password,
      );
    } catch (e) {
      return {
        statusCode: e.statusCode,
        message: e.message,
      };
    }
  }
}
