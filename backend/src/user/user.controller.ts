import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseInterface } from './types';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { JwtGuard } from '@app/auth/guards';
import { UserEntity } from './entities/user.entity';
import { GetUser } from '@app/auth/decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.create(createUserDto);
    return this.userService.buildResponse(user);
  }

  @Post("login")
  async signIn(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.signIn(loginUserDto);
    return this.userService.buildResponse(user);
  }
  @UseGuards(JwtGuard)
  @Get('me')
  async currentUser(@GetUser() user: UserEntity) {
    return this.userService.buildResponse(user);
  }

  @Patch()
  @UseGuards(JwtGuard)
  async update(@GetUser('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(userId, updateUserDto);
    return this.userService.buildResponse(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
