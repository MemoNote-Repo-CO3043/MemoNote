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

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

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
