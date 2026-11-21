import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { UserDto } from './user.dto.js';
import { UserCredentialDto } from './user-credential.dto.js';
import { UserIdentityDto } from './user.identity.dto.js';

export class CreateUserDto {
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ValidateNested()
  @Type(() => UserCredentialDto)
  credential?: UserCredentialDto | null;

  @ValidateNested({ each: true })
  @Type(() => UserIdentityDto)
  @IsArray()
  identities?: UserIdentityDto[] | null;
}
