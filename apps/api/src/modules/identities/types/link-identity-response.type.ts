import { EIdentityProvider } from '../../user/enums/identity-provider.enum.js';

export type TLinkIdentityResponse = {
  message: string;
  data: {
    userId: string;
    provider: EIdentityProvider;
  };
};
