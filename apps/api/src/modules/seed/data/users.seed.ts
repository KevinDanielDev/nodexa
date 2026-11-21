import { EIdentityProvider, EUserStatus } from '../../user/enums/index.js';
import { TUserSeed } from '../types/user-seed.type.js';

export const usersSeed: TUserSeed[] = [
  {
    user: {
      email: 'seed.user.001@gmail.com',
      firstName: 'Seed',
      lastName: 'User 001',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.002@gmail.com',
      firstName: 'Seed',
      lastName: 'User 002',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-002',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.003@gmail.com',
      firstName: 'Seed',
      lastName: 'User 003',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-003',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.004@gmail.com',
      firstName: 'Seed',
      lastName: 'User 004',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.005@gmail.com',
      firstName: 'Seed',
      lastName: 'User 005',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-005',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.006@gmail.com',
      firstName: 'Seed',
      lastName: 'User 006',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-006',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.007@gmail.com',
      firstName: 'Seed',
      lastName: 'User 007',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.008@gmail.com',
      firstName: 'Seed',
      lastName: 'User 008',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-008',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.009@gmail.com',
      firstName: 'Seed',
      lastName: 'User 009',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-009',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.010@gmail.com',
      firstName: 'Seed',
      lastName: 'User 010',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.011@gmail.com',
      firstName: 'Seed',
      lastName: 'User 011',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-011',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.012@gmail.com',
      firstName: 'Seed',
      lastName: 'User 012',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-012',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.013@gmail.com',
      firstName: 'Seed',
      lastName: 'User 013',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.014@gmail.com',
      firstName: 'Seed',
      lastName: 'User 014',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-014',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.015@gmail.com',
      firstName: 'Seed',
      lastName: 'User 015',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-015',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.016@gmail.com',
      firstName: 'Seed',
      lastName: 'User 016',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.017@gmail.com',
      firstName: 'Seed',
      lastName: 'User 017',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-017',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.018@gmail.com',
      firstName: 'Seed',
      lastName: 'User 018',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-018',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.019@gmail.com',
      firstName: 'Seed',
      lastName: 'User 019',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.020@gmail.com',
      firstName: 'Seed',
      lastName: 'User 020',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-020',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.021@gmail.com',
      firstName: 'Seed',
      lastName: 'User 021',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-021',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.022@gmail.com',
      firstName: 'Seed',
      lastName: 'User 022',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.023@gmail.com',
      firstName: 'Seed',
      lastName: 'User 023',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-023',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.024@gmail.com',
      firstName: 'Seed',
      lastName: 'User 024',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-024',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.025@gmail.com',
      firstName: 'Seed',
      lastName: 'User 025',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.026@gmail.com',
      firstName: 'Seed',
      lastName: 'User 026',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-026',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.027@gmail.com',
      firstName: 'Seed',
      lastName: 'User 027',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-027',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.028@gmail.com',
      firstName: 'Seed',
      lastName: 'User 028',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.029@gmail.com',
      firstName: 'Seed',
      lastName: 'User 029',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-029',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.030@gmail.com',
      firstName: 'Seed',
      lastName: 'User 030',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-030',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.031@gmail.com',
      firstName: 'Seed',
      lastName: 'User 031',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.032@gmail.com',
      firstName: 'Seed',
      lastName: 'User 032',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-032',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.033@gmail.com',
      firstName: 'Seed',
      lastName: 'User 033',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-033',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.034@gmail.com',
      firstName: 'Seed',
      lastName: 'User 034',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.035@gmail.com',
      firstName: 'Seed',
      lastName: 'User 035',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-035',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.036@gmail.com',
      firstName: 'Seed',
      lastName: 'User 036',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-036',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.037@gmail.com',
      firstName: 'Seed',
      lastName: 'User 037',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.038@gmail.com',
      firstName: 'Seed',
      lastName: 'User 038',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-038',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.039@gmail.com',
      firstName: 'Seed',
      lastName: 'User 039',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-039',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.040@gmail.com',
      firstName: 'Seed',
      lastName: 'User 040',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.041@gmail.com',
      firstName: 'Seed',
      lastName: 'User 041',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-041',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.042@gmail.com',
      firstName: 'Seed',
      lastName: 'User 042',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-042',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.043@gmail.com',
      firstName: 'Seed',
      lastName: 'User 043',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.044@gmail.com',
      firstName: 'Seed',
      lastName: 'User 044',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-044',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.045@gmail.com',
      firstName: 'Seed',
      lastName: 'User 045',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-045',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.046@gmail.com',
      firstName: 'Seed',
      lastName: 'User 046',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.047@gmail.com',
      firstName: 'Seed',
      lastName: 'User 047',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-047',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.048@gmail.com',
      firstName: 'Seed',
      lastName: 'User 048',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-048',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.049@gmail.com',
      firstName: 'Seed',
      lastName: 'User 049',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.050@gmail.com',
      firstName: 'Seed',
      lastName: 'User 050',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-050',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.051@gmail.com',
      firstName: 'Seed',
      lastName: 'User 051',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-051',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.052@gmail.com',
      firstName: 'Seed',
      lastName: 'User 052',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.053@gmail.com',
      firstName: 'Seed',
      lastName: 'User 053',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-053',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.054@gmail.com',
      firstName: 'Seed',
      lastName: 'User 054',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-054',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.055@gmail.com',
      firstName: 'Seed',
      lastName: 'User 055',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.056@gmail.com',
      firstName: 'Seed',
      lastName: 'User 056',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-056',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.057@gmail.com',
      firstName: 'Seed',
      lastName: 'User 057',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-057',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.058@gmail.com',
      firstName: 'Seed',
      lastName: 'User 058',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.059@gmail.com',
      firstName: 'Seed',
      lastName: 'User 059',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-059',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.060@gmail.com',
      firstName: 'Seed',
      lastName: 'User 060',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-060',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.061@gmail.com',
      firstName: 'Seed',
      lastName: 'User 061',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.062@gmail.com',
      firstName: 'Seed',
      lastName: 'User 062',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-062',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.063@gmail.com',
      firstName: 'Seed',
      lastName: 'User 063',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-063',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.064@gmail.com',
      firstName: 'Seed',
      lastName: 'User 064',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.065@gmail.com',
      firstName: 'Seed',
      lastName: 'User 065',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-065',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.066@gmail.com',
      firstName: 'Seed',
      lastName: 'User 066',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-066',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.067@gmail.com',
      firstName: 'Seed',
      lastName: 'User 067',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.068@gmail.com',
      firstName: 'Seed',
      lastName: 'User 068',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-068',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.069@gmail.com',
      firstName: 'Seed',
      lastName: 'User 069',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-069',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.070@gmail.com',
      firstName: 'Seed',
      lastName: 'User 070',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.071@gmail.com',
      firstName: 'Seed',
      lastName: 'User 071',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-071',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.072@gmail.com',
      firstName: 'Seed',
      lastName: 'User 072',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-072',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.073@gmail.com',
      firstName: 'Seed',
      lastName: 'User 073',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.074@gmail.com',
      firstName: 'Seed',
      lastName: 'User 074',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-074',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.075@gmail.com',
      firstName: 'Seed',
      lastName: 'User 075',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-075',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.076@gmail.com',
      firstName: 'Seed',
      lastName: 'User 076',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.077@gmail.com',
      firstName: 'Seed',
      lastName: 'User 077',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-077',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.078@gmail.com',
      firstName: 'Seed',
      lastName: 'User 078',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-078',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.079@gmail.com',
      firstName: 'Seed',
      lastName: 'User 079',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.080@gmail.com',
      firstName: 'Seed',
      lastName: 'User 080',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-080',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.081@gmail.com',
      firstName: 'Seed',
      lastName: 'User 081',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-081',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.082@gmail.com',
      firstName: 'Seed',
      lastName: 'User 082',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.083@gmail.com',
      firstName: 'Seed',
      lastName: 'User 083',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-083',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.084@gmail.com',
      firstName: 'Seed',
      lastName: 'User 084',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-084',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.085@gmail.com',
      firstName: 'Seed',
      lastName: 'User 085',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.086@gmail.com',
      firstName: 'Seed',
      lastName: 'User 086',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-086',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.087@gmail.com',
      firstName: 'Seed',
      lastName: 'User 087',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-087',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.088@gmail.com',
      firstName: 'Seed',
      lastName: 'User 088',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.089@gmail.com',
      firstName: 'Seed',
      lastName: 'User 089',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-089',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.090@gmail.com',
      firstName: 'Seed',
      lastName: 'User 090',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-090',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.091@gmail.com',
      firstName: 'Seed',
      lastName: 'User 091',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.092@gmail.com',
      firstName: 'Seed',
      lastName: 'User 092',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-092',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.093@gmail.com',
      firstName: 'Seed',
      lastName: 'User 093',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-093',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.094@gmail.com',
      firstName: 'Seed',
      lastName: 'User 094',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.095@gmail.com',
      firstName: 'Seed',
      lastName: 'User 095',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-095',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.096@gmail.com',
      firstName: 'Seed',
      lastName: 'User 096',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-096',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.097@gmail.com',
      firstName: 'Seed',
      lastName: 'User 097',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
  {
    user: {
      email: 'seed.user.098@gmail.com',
      firstName: 'Seed',
      lastName: 'User 098',
      status: EUserStatus.ACTIVE,
    },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-098',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.099@gmail.com',
      firstName: 'Seed',
      lastName: 'User 099',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [
      {
        provider: EIdentityProvider.GOOGLE,
        providerSubject: 'seed-google-subject-099',
      },
    ],
  },
  {
    user: {
      email: 'seed.user.100@gmail.com',
      firstName: 'Seed',
      lastName: 'User 100',
      status: EUserStatus.ACTIVE,
    },
    credential: { passwordHash: 'seed-password-hash' },
    identities: [],
  },
];
