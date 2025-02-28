import { execSync } from 'child_process';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { ProjectConfig } from '../../cli.js';

export async function setupTailwind(config: ProjectConfig, projectDir: string, emitLog: (message: string) => void) {
  try {
    emitLog('Installing Tailwind CSS...');
    execSync('npm install -D tailwindcss postcss autoprefixer', { cwd: projectDir });
    execSync('npx tailwindcss init -p', { cwd: projectDir });

    // Add Tailwind configuration
    const tailwindConfig = `
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

    await writeFile(join(projectDir, 'tailwind.config.js'), tailwindConfig);
    
    // Add Tailwind directives to CSS
    const cssContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;`;

    await writeFile(join(projectDir, 'src/index.css'), cssContent);
    
    emitLog('Tailwind CSS setup completed');
  } catch (error) {
    emitLog('Failed to setup Tailwind CSS');
    throw error;
  }
} 