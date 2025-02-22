import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { execSync } from 'child_process';

export async function createVueJS(config, projectDir) {
    console.log("Creating Vue JavaScript frontend...");
    
    await execSync(`npm create vite@latest frontend -- --template vue`, {
        cwd: projectDir,
        stdio: 'inherit'
    });

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
    })`;

    await writeFile(
        join(projectDir, 'frontend', 'vite.config.js'),
        viteConfig.trim()
    );

    console.log("Installing additional dependencies...");
    await execSync('npm install vue-router@4 pinia@2', {
        cwd: join(projectDir, 'frontend'),
        stdio: 'inherit'
    });

    // Create basic Vue structure
    await mkdir(join(projectDir, 'frontend', 'src', 'router'), { recursive: true });
    await mkdir(join(projectDir, 'frontend', 'src', 'stores'), { recursive: true });
    await mkdir(join(projectDir, 'frontend', 'src', 'components'), { recursive: true });

    // Create router setup
    const routerSetup = `
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue')
    }
  ]
})

export default router`;

    await writeFile(
        join(projectDir, 'frontend', 'src', 'router', 'index.js'),
        routerSetup.trim()
    );

    // Create store setup
    const storeSetup = `
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})`;

    await writeFile(
        join(projectDir, 'frontend', 'src', 'stores', 'main.js'),
        storeSetup.trim()
    );
}