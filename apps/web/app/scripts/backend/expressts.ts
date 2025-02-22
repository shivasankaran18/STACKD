import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function createExpressTS(config: any, projectDir: string) {
    await mkdir(join(projectDir, 'backend'))
    
    const backendPackageJson = {
        name: "backend",
        version: "1.0.0",
        scripts: {
            "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
            "build": "tsc",
            "start": "node dist/index.js"
        },
        dependencies: {
            "express": "^4.18.2",
            "cors": "^2.8.5",
            "dotenv": "^16.3.1"
        },
        devDependencies: {
            "@types/express": "^4.17.17",
            "@types/cors": "^2.8.13",
            "@types/node": "^20.4.5",
            "typescript": "^5.1.6",
            "ts-node-dev": "^2.0.0"
        }
    }

    await writeFile(
        join(projectDir, 'backend', 'package.json'),
        JSON.stringify(backendPackageJson, null, 2)
    )

    const tsConfig = {
        compilerOptions: {
            "target": "ES2020",
            "module": "CommonJS",
            "lib": ["ES2020"],
            "moduleResolution": "node",
            "outDir": "./dist",
            "rootDir": "./src",
            "strict": true,
            "esModuleInterop": true,
            "skipLibCheck": true,
            "forceConsistentCasingInFileNames": true,
            "resolveJsonModule": true
        },
        include: ["src/**/*"],
        exclude: ["node_modules"]
    }

    await writeFile(
        join(projectDir, 'backend', 'tsconfig.json'),
        JSON.stringify(tsConfig, null, 2)
    )

    await mkdir(join(projectDir, 'backend', 'src'))

    const backendIndex = `
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || ${config.backendPort};

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
});`

    await writeFile(
        join(projectDir, 'backend', 'src', 'index.ts'),
        backendIndex.trim()
    )
}