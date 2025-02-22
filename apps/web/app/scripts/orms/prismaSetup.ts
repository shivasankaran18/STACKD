import { join } from 'node:path'
import { execSync } from 'node:child_process'


export async function setupPrisma(config: any, projectDir: string) {

    const backendDir = join(projectDir, 'backend');

    await execSync('npm install prisma', { cwd: backendDir });
    await execSync('npx prisma init', { cwd: backendDir });
}