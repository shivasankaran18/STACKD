import { join } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import 'dotenv/config'

export async function setupDrizzle(config, projectDir, emitLog) {
    try {
        emitLog('Starting Drizzle ORM setup...');
        const backendDir = join(projectDir, 'backend');
        const dbDir = join(backendDir, 'src', 'db');
        const schemasDir = join(dbDir, 'schema');
        emitLog('Creating directory structure...');
        await mkdir(schemasDir, { recursive: true });
        emitLog('✅ Directory structure created');

        emitLog('Generating environment configuration...');
        const envContent = `
# Database Configuration
${config.env?.DATABASE_URL_ENV || 'DATABASE_URL'}=postgres://user:password@localhost:5432/${config.databaseName || 'myapp'}
# Add other environment variables here
NODE_ENV=development
PORT=3000
`;
        await writeFile(
            join(backendDir, '.env'),
            envContent.trim() + '\n'
        );
        emitLog('✅ Environment configuration created');

        emitLog('Setting up database connection...');
        const dbCode = `
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.${config.env?.DATABASE_URL_ENV || 'DATABASE_URL'},
});

export const db = drizzle(pool);

export async function connectDB() {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

export async function disconnectDB() {
    await pool.end();
    console.log('Disconnected from PostgreSQL database');
}
`;
        await writeFile(
            join(dbDir, 'index.ts'),
            dbCode
        );
        emitLog('✅ Database connection setup complete');

        emitLog('Creating example schema...');
        const exampleSchemaCode = `
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const examples = pgTable('examples', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
`;
        await writeFile(
            join(schemasDir, 'example.ts'),
            exampleSchemaCode
        );
        emitLog('✅ Example schema created');

        emitLog('Configuring Drizzle migrations...');
        const drizzleConfigCode = `
import type { Config } from 'drizzle-kit';

export default {
    schema: './src/db/schema/*',
    out: './src/db/migrations',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.${config.env?.DATABASE_URL_ENV || 'DATABASE_URL'}!,
    },
} satisfies Config;
`;
        await writeFile(
            join(backendDir, 'drizzle.config.ts'),
            drizzleConfigCode
        );
        emitLog('✅ Drizzle configuration complete');

        emitLog('✅ Drizzle ORM setup completed successfully!');
    } catch (error) {
        emitLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
}
