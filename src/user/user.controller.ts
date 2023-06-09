import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { password, passwordConfirmation } = createUserDto;

    if (password.length < 6) {
      throw new BadRequestException("password must have at least 6 characters");
    }

    if (password !== passwordConfirmation) {
      throw new BadRequestException("password and passwordConfirmation did not match");
    }

    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll() {
    const usersList = await this.userService.findAll();
    return usersList.map(user => {
      return {
        ...user,
        password: undefined
      }
    })
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    try {
      return this.userService.remove(id);
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
