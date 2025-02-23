import { join } from 'node:path'
import { execSync } from 'child_process'
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'fs'

export async function createNextJS(config: any, projectDir: string, emitLog: (log: string) => void) {
    try {
        const frontendDir = join(projectDir, 'frontend');
        if (!existsSync(frontendDir)) {
            emitLog('Creating frontend directory...');
            await mkdir(frontendDir, { recursive: true });
        }
        emitLog('Creating Next.js project...');
        execSync('npm init next-app@latest . -- --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git', {
            cwd: frontendDir,
            stdio: 'inherit',
            shell: true,
        });

        emitLog('Updating package.json...');
        const packageJsonPath = join(frontendDir, 'package.json');
        const packageJson = require(packageJsonPath);
        
        packageJson.scripts.dev = `next dev -p ${config.frontendPort}`;
        
        await writeFile(
            packageJsonPath,
            JSON.stringify(packageJson, null, 2)
        );

        emitLog('Creating environment file...');
        const envContent = `
NEXT_PUBLIC_API_URL=http://localhost:${config.backendPort}
NEXTAUTH_URL=http://localhost:${config.frontendPort}
NEXTAUTH_SECRET=your-secret-key-here
`;

        await writeFile(
            join(frontendDir, '.env'),
            envContent.trim() + '\n'
        );

        emitLog('Setting up API proxy...');
        const nextConfigContent = `
/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:${config.backendPort}/api/:path*'
            }
        ]
    }
}

module.exports = nextConfig
`;

        await writeFile(
            join(frontendDir, 'next.config.js'),
            nextConfigContent.trim() + '\n'
        );

        emitLog('✅ Next.js setup completed successfully!');
    } catch (error) {
        emitLog(`❌ Error setting up Next.js: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
}
