import { EUserStatus } from '../enums/user-status.enum.js';

export type TCreateUserResponse = {
  message: string;
  user: {
    normalizedEmail: string;
    firstName: string;
    lastName: string;
    displayName?: string | null;
    avatarUrl?: string | null;
    status: EUserStatus;
    emailVerifiedAt?: Date | null;
    lastLoginAt?: Date | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt?: Date | null;
  };
};
