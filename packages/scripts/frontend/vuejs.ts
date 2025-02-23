import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

export async function createVueJS(config: any, projectDir: string,emitLog: (log: string) => void) {
    emitLog('Creating VueJS project...');
    await execSync(`npm create vite@latest frontend -- --template vue`, {
        cwd: projectDir,
        stdio: 'inherit'
    })

    emitLog('Installing Vite...');
    console.log(projectDir)
    console.log(config)
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
        join(projectDir, 'frontend', `vite.config.js`),
        viteConfig.trim()
    )
    emitLog('Installing Vue Router and Pinia...');
    await execSync('npm install vue-router@4 pinia@2', {
        cwd: join(projectDir, 'frontend'),
        stdio: 'inherit'
    })
    emitLog('✅ VueJS project created successfully!');
}
