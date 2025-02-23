import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { execSync } from 'child_process';

export async function createReactJS(config, projectDir,emitLog) {
    emitLog("Creating React JavaScript frontend...");
    
    await execSync(`npm create vite@latest frontend -- --template react`, {
        cwd: projectDir,
      stdio: 'inherit',
        shell: true
    });

    emitLog("Installing dependencies...");
    await execSync('npm install', {
        cwd: join(projectDir, 'frontend'),
        stdio: 'inherit',
        shell: true
    });

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
    })`;

    await writeFile(
        join(projectDir, 'frontend', 'vite.config.js'),
        viteConfig.trim()
    );
}