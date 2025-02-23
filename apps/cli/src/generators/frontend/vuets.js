import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

export async function createVueTS(config, projectDir,emitLog) {
    emitLog('Creating VueTS project...');

    emitLog('Installing Vite...');  
    await execSync(`npm create vite@latest frontend -- --template vue-ts`, {
        cwd: projectDir,
        stdio: 'inherit'
    })

    emitLog('Configuring Vite...');
    const viteConfig = `
    import { defineConfig } from 'vite'
    import vue from '@vitejs/plugin-vue'
    
    export default defineConfig({
      plugins: [vue()],
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

    emitLog('Writing Vite configuration...');
    await writeFile(
        join(projectDir, 'frontend', `vite.config.ts`),
        viteConfig.trim()
    )

    emitLog('Installing Vue Router and Pinia...');
    await execSync('npm install vue-router@4 pinia@2', {
        cwd: join(projectDir, 'frontend'),
        stdio: 'inherit'
    })

    emitLog('Installing TypeScript and other dependencies...');
    if (config.frontend === 'vue-ts') {
        await execSync('npm install -D @types/node', {
            cwd: join(projectDir, 'frontend'),
            stdio: 'inherit'
        })
    }

    emitLog('✅ VueTS project created successfully!');
}
