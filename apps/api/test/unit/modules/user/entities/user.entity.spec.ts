import { UnprocessableEntityException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import { User } from '../../../../../src/modules/user/entities/user.entity.js';

type UserInsertHook = {
  prepareDataBeforeInsert: () => void;
};

const runInsertHook = (user: User): void => {
  (user as unknown as UserInsertHook).prepareDataBeforeInsert();
};

describe('User entity', () => {
  it('normalizes an allowed email and derives the display name', () => {
    const user = new User();
    user.email = 'Person@Gmail.com';
    user.firstName = ' Ada ';
    user.lastName = ' Lovelace ';

    runInsertHook(user);

    expect(user.normalizedEmail).toBe('person@gmail.com');
    expect(user.displayName).toBe('Ada   Lovelace');
  });

  it('rejects an email from a domain outside the application policy', () => {
    const user = new User();
    user.email = 'person@example.com';
    user.firstName = 'Ada';
    user.lastName = 'Lovelace';

    expect(() => runInsertHook(user)).toThrow(
      new UnprocessableEntityException('Email domain is not allowed'),
    );
  });

  it('trims the generated display name', () => {
    const user = new User();
    user.email = 'person@gmail.com';
    user.firstName = 'Ada';
    user.lastName = '';

    runInsertHook(user);

    expect(user.displayName).toBe('Ada');
  });
});
