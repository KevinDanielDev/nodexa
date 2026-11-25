import { describe, expect, it } from 'vitest';

import { passwordHash } from '../../../../../src/modules/common/utils/password-hash.js';
import { verifyPassword } from '../../../../../src/modules/common/utils/verify-password.js';

describe('verifyPassword', () => {
  it('returns true for the password used to create the hash', async () => {
    const hash = await passwordHash('password123');

    await expect(verifyPassword('password123', hash)).resolves.toBe(true);
  });

  it('returns false for an incorrect password', async () => {
    const hash = await passwordHash('password123');

    await expect(verifyPassword('wrong-password', hash)).resolves.toBe(false);
  });

  it('returns false instead of throwing for an invalid hash', async () => {
    await expect(verifyPassword('password123', 'invalid-hash')).resolves.toBe(
      false,
    );
  });
});
