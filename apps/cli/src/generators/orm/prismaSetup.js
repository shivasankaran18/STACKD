import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs';


export async function setupPrisma(config, projectDir,emitLog) {
    emitLog('Setting up Prisma...');
    const backendDir = join(projectDir, 'backend');
    const envContent = `DATABASE_URL=${config.dbUrl}\n`;
    writeFileSync(join(projectDir, 'backend', '.env'), envContent);
    await execSync('npm install prisma', { cwd: backendDir });
    await execSync('npx prisma init', { cwd: backendDir });
    emitLog('✅ Prisma setup complete');
}