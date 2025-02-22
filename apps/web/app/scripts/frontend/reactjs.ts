import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

export async function createReactJS(config: any, projectDir: string) {
    await execSync(`npm create vite@latest frontend -- --template react`, {
        cwd: projectDir,
        stdio: 'inherit'
    })
    console.log("Intalling the dependcies for the frontend");
    await execSync("npm install",{cwd:projectDir + "/frontend",stdio:"inherit"});
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
        join(projectDir, 'frontend', 'vite.config.js'),
        viteConfig.trim()
    )
} 