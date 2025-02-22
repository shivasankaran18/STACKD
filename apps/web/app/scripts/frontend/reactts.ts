import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

export async function createReactTS(config: any, projectDir: string,emitLog: (log: string) => void) {
    emitLog('Creating ReactTS project...');
    await execSync(`npm create vite@latest frontend -- --template react-ts`, {
      cwd: projectDir,
      stdio: 'inherit'
    });
    emitLog('Installing the dependencies...');
    await execSync('npm install',{cwd : projectDir + '/frontend',stdio : 'inherit'});
    emitLog('Writing Vite configuration...');
    const viteConfig = `
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    export default defineConfig({
      plugins: [react()],
      server: {
        port: ${config.frontendPort},
        proxy: {
          '/api': {
            target: 'http://localhost:${config.backendPort}',
            changeOrigin: true
          }
        }
      }
    })`
    await writeFile(
        join(projectDir, 'frontend', 'vite.config.ts'),
        viteConfig.trim()
    )
    emitLog('✅ ReactTS project created successfully!');
}