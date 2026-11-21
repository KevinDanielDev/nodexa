import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UserCredentialDto {
  @IsString()
  @IsOptional()
  @MaxLength(16)
  @MinLength(8)
  password?: string | null;
}
