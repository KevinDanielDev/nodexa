import { EIdentityProvider, EUserStatus } from '../../user/enums/index.js';

export type TUserSeed = {
  user: TSeedUser;
  credential?: TSeedCredential;
  identities: TSeedIdentity[];
};

// Private types for user seed data
type TSeedUser = {
  email: string;
  firstName: string;
  lastName: string;
  status: EUserStatus;
};

type TSeedCredential = {
  passwordHash: string;
};

type TSeedIdentity = {
  provider: EIdentityProvider;
  providerSubject: string;
};
