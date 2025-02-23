import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

export async function setupTailwindCSS(
    config,
    projectDir,
    emitLog
) {
    try {
        const frontendDir = join(projectDir, 'frontend');
        const srcDir = join(frontendDir, 'src');
        
        // Ensure directories exist
        if (!existsSync(frontendDir)) {
            emitLog('Creating frontend directory...');
            await mkdir(frontendDir, { recursive: true });
        }

        if (!existsSync(srcDir)) {
            emitLog('Creating src directory...');
            await mkdir(srcDir, { recursive: true });
        }

        // Initialize package.json if it doesn't exist
        if (!existsSync(join(frontendDir, 'package.json'))) {
            emitLog('Initializing package.json...');
            execSync('npm init -y', {
                cwd: frontendDir,
                stdio: 'inherit'
            });
        }

        // Install dependencies using npm directly
        emitLog('Installing Tailwind CSS dependencies...');
        execSync('npm install tailwindcss@latest postcss@latest autoprefixer@latest --save-dev', {
            cwd: frontendDir,
            stdio: 'inherit'
        });

        // Create tailwind.config.js manually instead of using npx
        emitLog('Creating Tailwind configuration...');
        const tailwindConfig = generateTailwindConfig(config.frontend);
        await writeFile(
            join(frontendDir, 'tailwind.config.js'),
            tailwindConfig
        );

        // Create postcss.config.js
        emitLog('Creating PostCSS configuration...');
        const postcssConfig = `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
        await writeFile(
            join(frontendDir, 'postcss.config.js'),
            postcssConfig
        );

        // Add Tailwind directives to CSS
        emitLog('Creating CSS file with Tailwind directives...');
        const tailwindDirectives = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;
        await writeFile(
            join(srcDir, 'index.css'),
            tailwindDirectives
        );

        emitLog('✅ Tailwind CSS setup completed successfully!');
    } catch (error) {
        emitLog(`❌ Error setting up Tailwind CSS: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
}

function generateTailwindConfig(framework) {
    const baseConfig = {
        content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
            extend: {
                colors: {
                    background: 'hsl(var(--background))',
                    foreground: 'hsl(var(--foreground))',
                },
            },
        },
        plugins: [],
    };

    switch (framework) {
        case 'react-ts':
        case 'react':
            baseConfig.content = [
                "./index.html",
                "./src/**/*.{js,ts,jsx,tsx}",
            ];
            break;
        case 'vue-ts':
        case 'vue':
            baseConfig.content = [
                "./index.html",
                "./src/**/*.{vue,js,ts,jsx,tsx}",
            ];
            break;
        case 'django':
            baseConfig.content = [
                "./templates/**/*.html",
                "./static/**/*.{js,ts}",
            ];
            break;
    }

    return `/** @type {import('tailwindcss').Config} */
module.exports = ${JSON.stringify(baseConfig, null, 2)}`;
}