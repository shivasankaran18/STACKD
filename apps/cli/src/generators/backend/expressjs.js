import { execSync } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

export async function createExpressJS(config, projectDir,emitLog) {
    emitLog("Creating Express JavaScript backend...");
    
    await mkdir(join(projectDir, 'backend'));
    
    const backendPackageJson = {
        name: "backend",
        version: "1.0.0",
        scripts: {
            "dev": "nodemon src/index.js",
            "start": "node src/index.js"
        },
        dependencies: {
            "express": "^4.18.2",
            "cors": "^2.8.5",
            "dotenv": "^16.3.1"
        },
        devDependencies: {
            "nodemon": "^2.0.22"
        }
    };

    await writeFile(
        join(projectDir, 'backend', 'package.json'),
        JSON.stringify(backendPackageJson, null, 2)
    );

    await mkdir(join(projectDir, 'backend', 'src'));

    const backendIndex = `
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

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
});`;

    await writeFile(
        join(projectDir, 'backend', 'src', 'index.js'),
        backendIndex.trim()
    );

    emitLog("Installing backend dependencies...");
    await execSync("npm install", {
        cwd: join(projectDir, 'backend'),
        stdio: 'inherit',
        shell: true
    });
}