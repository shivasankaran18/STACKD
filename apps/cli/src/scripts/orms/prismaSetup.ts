import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs';


export async function setupPrisma(config: any, projectDir: string,emitLog: (log: string) => void) {
    emitLog('Setting up Prisma...');
    const backendDir = join(projectDir, 'backend');
    const envContent = `DATABASE_URL=${config.dbUrl}\n`;
    writeFileSync(join(projectDir, 'backend', '.env'), envContent);
    await execSync('npm install prisma', { cwd: backendDir,shell: process.platform === "win32" ? "powershell.exe" : "/bin/sh", });
    await execSync('npx prisma init', { cwd: backendDir,shell: process.platform === "win32" ? "powershell.exe" : "/bin/sh", });
    emitLog('✅ Prisma setup complete');
}