import { Options, SqliteDriver } from '@mikro-orm/sqlite';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
  // for simplicity, we use the SQLite database, as it's available pretty much everywhere
  driver: SqliteDriver,
  dbName: 'sqlite.db',
  // folder-based discovery setup, using common filename suffix
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
  // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
  metadataProvider: TsMorphMetadataProvider,
  // enable debug mode to log SQL queries and discovery information
  debug: process.env.NODE_ENV !== 'production', // Only enable in development

  // 6. Migrations Configuration (Crucial for schema changes)
  // This tells MikroORM where to store your migration files.
  // Migrations are version-controlled scripts that modify your database schema
  // (e.g., creating tables, adding columns).
  migrations: {
    path: './migrations', // Path to the folder where migration files will be stored
    fileName: (timestamp, name) => {
      // Optional: Custom naming for migration files
      // e.g., '1678886400-create-historical-requests-table.ts'
      return `${timestamp}-${name}.ts`;
    },
    // Other migration options:
    // disableForeignKeys: false, // Set to true if you want to skip foreign key checks during migrations
    // transactional: true,       // Wrap migrations in a transaction (default true)
    // snapshot: true,            // Store schema snapshot (default true)
  },
};

export default config;