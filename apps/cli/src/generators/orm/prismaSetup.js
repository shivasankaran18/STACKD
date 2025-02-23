import { join } from 'path';
import { execSync } from 'child_process';
import { writeFile } from 'fs/promises';

export async function setupPrisma(config, projectDir) {
    console.log("Setting up Prisma ORM...");
    
    const backendDir = join(projectDir, 'backend');

    console.log("Creating environment configuration...");
    const envContent = `DATABASE_URL=${config.dbUrl}\n`;
    await writeFile(join(backendDir, '.env'), envContent);

    console.log("Installing Prisma dependencies...");
    await execSync('npm install prisma @prisma/client', { 
        cwd: backendDir,
        stdio: 'inherit' 
    });

    console.log("Initializing Prisma...");
    await execSync('npx prisma init', { 
        cwd: backendDir,
        stdio: 'inherit'
    });

    const schemaExample = `
// This is an example schema. Modify according to your needs.
model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    name      String?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model Post {
    id        Int      @id @default(autoincrement())
    title     String
    content   String?
    published Boolean  @default(false)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}`;

    await writeFile(
        join(backendDir, 'prisma', 'example-schema.prisma'),
        schemaExample.trim()
    );

    console.log("Prisma setup completed!");
}