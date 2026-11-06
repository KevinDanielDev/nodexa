import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DataSource } from 'typeorm';

import 'dotenv/config.js';

import { User } from '../user/entities/user.entity.js';
import { UserSession } from '../user/entities/user-session.entity.js';
import { UserIdentity } from '../user/entities/user-identity.entity.js';
import { UserCredential } from '../user/entities/user-credential.entity.js';

// Consistency in ESM (ECMAScript Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const AppDataSource: DataSource = new DataSource({
  synchronize: false,
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, UserCredential, UserIdentity, UserSession], // Refactor: 'src/modules/**/entities/*.entity.{ts,js}' to avoid adding new entities manually
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
});

export default AppDataSource;
