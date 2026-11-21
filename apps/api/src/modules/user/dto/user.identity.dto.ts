import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EIdentityProvider } from '../enums/identity-provider.enum.js';

export class UserIdentityDto {
  @IsEnum(EIdentityProvider)
  @IsNotEmpty()
  provider: EIdentityProvider;

  @IsString()
  @IsNotEmpty()
  providerSubject: string;
}
