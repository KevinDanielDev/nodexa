import { EIdentityProvider } from '../../user/enums/identity-provider.enum.js';

export type TUnlinkIdentityResponse = {
  message: string;
  data: {
    userId: string;
    provider: EIdentityProvider;
  };
};
