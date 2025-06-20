// src/lib/mikro-orm.config.ts
import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql'; // <--- NEW IMPORT

import { HistoricalRequest } from './entities';

console.log(process.env.DATABASE_URL)

const config: Options = {
  driver: PostgreSqlDriver, // <--- NEW DRIVER

  // 2. Database Connection Details for PostgreSQL
  // You can use a clientUrl (connection string) or individual properties.
  // Using a clientUrl is often simpler, especially for deployment environments.
  // IMPORTANT: Replace with your actual PostgreSQL connection details
  clientUrl:"postgresql://neondb_owner:npg_lD1AgybrGIC5@ep-misty-cell-a8rtczec-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
  entities: [HistoricalRequest],

  // Debug Mode (Recommended for development)
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

  // This is typically needed for reflecting metadata from TypeScript classes
  // if you're not seeing your entities correctly.
  // metadataProvider: require('@mikro-orm/reflection').ReflectionMetadataProvider,

  // Enable request context for production, recommended for handling requests per transaction
  // MikroORM docs: https://mikro-orm.io/docs/identity-map#request-context
  // registerRequestContext: false, // Set to false if you handle EntityManager manually with fork()
};

export default config;