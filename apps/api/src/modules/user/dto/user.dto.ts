import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { EUserStatus } from '../enums/user-status.enum.js';

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(2)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(2)
  lastName: string;

  @IsString()
  @MaxLength(150)
  @IsOptional()
  displayName?: string | null;

  @IsString()
  @IsOptional()
  avatarUrl?: string | null;

  @IsEnum(EUserStatus)
  @IsOptional()
  status?: EUserStatus;
}
