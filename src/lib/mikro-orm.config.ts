import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { HistoricalRequest } from './entities';

// console.log(process.env.NEXT_PUBLIC_DATABASE_URL)

const config: Options = {
  driver: PostgreSqlDriver,

  clientUrl:"postgresql://neondb_owner:npg_lD1AgybrGIC5@ep-misty-cell-a8rtczec-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
  entities: [HistoricalRequest],
  debug: process.env.NODE_ENV !== 'production',

  // Migrations Configuration
  migrations: {
    path: './src/migrations', // Path for migration files (relative to project root)
    fileName: (timestamp, name) => `${timestamp}-${name}.ts`,
    // If you need to disable foreign key checks during migrations for specific reasons
    // disableForeignKeys: true,
  },

  driverOptions: {
    // This object is passed directly to the 'pg' client
    connection: {
      ssl: {
        // Ensure this is `true` for Neon, as their certificates are valid.
        // If you were on a self-signed dev server and it STILL failed,
        // you might use `false` (but NEVER in production).
        rejectUnauthorized: true,
      },
    },
  },
};

export default config;