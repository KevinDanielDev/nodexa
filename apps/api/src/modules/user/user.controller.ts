import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import type { TCreateUserResponse } from './types/create-user-response.type.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  public createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<TCreateUserResponse> {
    return this.userService.createUser(createUserDto);
  }
}
