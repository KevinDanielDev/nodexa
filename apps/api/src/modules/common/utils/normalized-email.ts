import { UnprocessableEntityException } from '@nestjs/common';

import { EMAILS_DOMAINS } from '../../user/constants/email-domains.constants.js';

export const normalizedEmail = (email: string): string => {
  const domain = email.split('@')[1]?.toLowerCase().trim();

  if (!domain || !EMAILS_DOMAINS.includes(domain))
    throw new UnprocessableEntityException('Email domain is not allowed.');
  return email.trim().toLocaleLowerCase();
};
