import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { EIdentityProvider } from '../../user/enums/identity-provider.enum.js';

export class UnlinkIdentityDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsEnum(EIdentityProvider)
  provider: EIdentityProvider;
}
