import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

export async function setupShadcn(
    config: any,
    projectDir: string,
    emitLog: (log: string) => void
) {
    try {
        const frontendDir = join(projectDir, 'frontend');
        emitLog('📦 Setting up shadcn/ui...');

        // Make sure Tailwind is set up first
        emitLog('Ensuring Tailwind CSS is set up...');

        // Install shadcn/ui dependencies
        emitLog('Installing shadcn/ui dependencies...');
        execSync('npm install @shadcn/ui class-variance-authority clsx tailwind-merge lucide-react', {
            cwd: frontendDir,
            stdio: 'inherit'
        });

        // Create components.json configuration
        const componentsConfig = {
            $schema: "https://ui.shadcn.com/schema.json",
            style: "default",
            rsc: false,
            tailwind: {
                config: "tailwind.config.js",
                css: "src/index.css",
                baseColor: "slate",
                cssVariables: true,
            },
            aliases: {
                components: "@/components",
                utils: "@/lib/utils"
            }
        };

        await writeFile(
            join(frontendDir, 'components.json'),
            JSON.stringify(componentsConfig, null, 2)
        );

        // Create utils file
        const utilsDir = join(frontendDir, 'src', 'lib');
        if (!existsSync(utilsDir)) {
            await mkdir(utilsDir, { recursive: true });
        }

        const utilsContent = `
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;

        await writeFile(
            join(utilsDir, 'utils.ts'),
            utilsContent.trim() + '\n'
        );

        emitLog('✅ shadcn/ui setup completed successfully!');
    } catch (error) {
        emitLog(`❌ Error setting up shadcn/ui: ${error instanceof Error ? error.message : 'Unknown error'}`);
        throw error;
    }
}

function generateShadcnTailwindConfig(frontend: string): string {
    const baseConfig = {
        darkMode: ["class"],
        content: frontend === 'django' 
            ? ["./templates/**/*.html", "./static/**/*.{js,ts}"]
            : ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
        theme: {
            container: {
                center: true,
                padding: "2rem",
                screens: {
                    "2xl": "1400px",
                },
            },
            extend: {
                colors: {
                    border: "hsl(var(--border))",
                    input: "hsl(var(--input))",
                    ring: "hsl(var(--ring))",
                    background: "hsl(var(--background))",
                    foreground: "hsl(var(--foreground))",
                    primary: {
                        DEFAULT: "hsl(var(--primary))",
                        foreground: "hsl(var(--primary-foreground))",
                    },
                    secondary: {
                        DEFAULT: "hsl(var(--secondary))",
                        foreground: "hsl(var(--secondary-foreground))",
                    },
                    destructive: {
                        DEFAULT: "hsl(var(--destructive))",
                        foreground: "hsl(var(--destructive-foreground))",
                    },
                    muted: {
                        DEFAULT: "hsl(var(--muted))",
                        foreground: "hsl(var(--muted-foreground))",
                    },
                    accent: {
                        DEFAULT: "hsl(var(--accent))",
                        foreground: "hsl(var(--accent-foreground))",
                    },
                    popover: {
                        DEFAULT: "hsl(var(--popover))",
                        foreground: "hsl(var(--popover-foreground))",
                    },
                    card: {
                        DEFAULT: "hsl(var(--card))",
                        foreground: "hsl(var(--card-foreground))",
                    },
                },
                borderRadius: {
                    lg: "var(--radius)",
                    md: "calc(var(--radius) - 2px)",
                    sm: "calc(var(--radius) - 4px)",
                },
                keyframes: {
                    "accordion-down": {
                        from: { height: "0" },
                        to: { height: "var(--radix-accordion-content-height)" },
                    },
                    "accordion-up": {
                        from: { height: "var(--radix-accordion-content-height)" },
                        to: { height: "0" },
                    },
                },
                animation: {
                    "accordion-down": "accordion-down 0.2s ease-out",
                    "accordion-up": "accordion-up 0.2s ease-out",
                },
            },
        },
        plugins: ["require('tailwindcss-animate')"],
    };

    return `/** @type {import('tailwindcss').Config} */
export default ${JSON.stringify(baseConfig, null, 2)}`;
}

function generateShadcnStyles(frontend: string): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;
}
