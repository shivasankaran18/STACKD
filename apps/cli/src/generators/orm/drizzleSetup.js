import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { execSync } from 'child_process';

export async function setupDrizzle(config, projectDir) {
    console.log("Setting up Drizzle ORM...");

    const backendDir = join(projectDir, 'backend');
    const dbDir = join(backendDir, 'src', 'db');
    const schemasDir = join(dbDir, 'schema');

    // Create directory structure
    console.log("Creating directory structure...");
    await mkdir(schemasDir, { recursive: true });

    // Create environment configuration
    console.log("Setting up environment configuration...");
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

    // Install Drizzle dependencies
    console.log("Installing Drizzle dependencies...");
    await execSync('npm install drizzle-orm pg', {
        cwd: backendDir,
        stdio: 'inherit'
    });

    await execSync('npm install -D drizzle-kit @types/pg', {
        cwd: backendDir,
        stdio: 'inherit'
    });

    // Create database connection setup
    console.log("Setting up database connection...");
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
}`;

    await writeFile(
        join(dbDir, 'index.ts'),
        dbCode.trim()
    );

    // Create example schema
    console.log("Creating example schema...");
    const exampleSchemaCode = `
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const examples = pgTable('examples', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});`;

    await writeFile(
        join(schemasDir, 'example.ts'),
        exampleSchemaCode.trim()
    );

    // Create Drizzle config
    console.log("Creating Drizzle configuration...");
    const drizzleConfigCode = `
import type { Config } from 'drizzle-kit';

export default {
    schema: './src/db/schema/*',
    out: './src/db/migrations',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.${config.env?.DATABASE_URL_ENV || 'DATABASE_URL'}!,
    },
} satisfies Config;`;

    await writeFile(
        join(backendDir, 'drizzle.config.ts'),
        drizzleConfigCode.trim()
    );

    console.log("Drizzle ORM setup completed!");
}