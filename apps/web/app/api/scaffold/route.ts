import { NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { execSync } from 'node:child_process'
import { createReactTS } from '@/app/scripts/frontend/reactts'
import { createReactJS } from '@/app/scripts/frontend/reactjs'
import { createExpressTS } from '@/app/scripts/backend/expressts'
import { createExpressJS } from '@/app/scripts/backend/expressjs'

export async function POST(req: NextRequest) {
    try {
        const config = await req.json()
        const projectDir = join(config.projectPath, config.projectName)

        await mkdir(projectDir, { recursive: true })
        
        // Select and create frontend based on config
        switch(config.frontend) {
            case 'react-ts':
                await createReactTS(config, projectDir)
                break
            case 'react':
                await createReactJS(config, projectDir)
                break
            default:
                throw new Error(`Unsupported frontend: ${config.frontend}`)
        }

        // Select and create backend based on config
        switch(config.backend) {
            case 'express-ts':
                await createExpressTS(config, projectDir)
                break
            case 'express':
                await createExpressJS(config, projectDir)
                break
            default:
                throw new Error(`Unsupported backend: ${config.backend}`)
        }

        // Create root package.json
        const rootPackageJson = {
            name: config.projectName,
            version: '1.0.0',
            private: true,
            scripts: {
                "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
                "dev:frontend": "cd frontend && npm run dev",
                "dev:backend": "cd backend && npm run dev",
                "build": "concurrently \"cd frontend && npm run build\" \"cd backend && npm run build\"",
                "install:all": "concurrently \"cd frontend && npm install\" \"cd backend && npm install\"",
                "start": "concurrently \"cd frontend && npm run preview\" \"cd backend && npm start\""
            },
            devDependencies: {
                "concurrently": "^8.2.0"
            }
        }

        await writeFile(
            join(projectDir, 'package.json'),
            JSON.stringify(rootPackageJson, null, 2)
        )

        // Create README.md
        const readme = `
# ${config.projectName}

Full-stack application with React frontend and Express backend.

## Development

1. Install dependencies:
   \`\`\`bash
   npm install
   npm run install:all
   \`\`\`

2. Start development servers:
   \`\`\`bash
   npm run dev
   \`\`\`

   - Frontend: http://localhost:${config.frontendPort}
   - Backend: http://localhost:${config.backendPort}

## Production

1. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`

2. Start production servers:
   \`\`\`bash
   npm start
   \`\`\`

## Project Structure

\`\`\`
${config.projectName}/
├── frontend/          # React frontend (Vite)
├── backend/           # Express backend
│   ├── src/          # TypeScript source files
│   └── dist/         # Compiled JavaScript
└── package.json      # Root package.json for project management
\`\`\`
`

        await writeFile(
            join(projectDir, 'README.md'),
            readme.trim()
        )

        // Create .gitignore
        const gitignore = `
# Dependencies
node_modules
.pnp
.pnp.js

# Production
dist
build

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
`

        await writeFile(
            join(projectDir, '.gitignore'),
            gitignore.trim()
        )

        // Install dependencies
        console.log('Installing dependencies...')
        execSync('npm install', { cwd: projectDir, stdio: 'inherit' })
        execSync('npm run install:all', { cwd: projectDir, stdio: 'inherit' })

        // Start the servers
        console.log('Starting servers...')
        execSync('npm run dev', { cwd: projectDir, stdio: 'inherit' })

        return NextResponse.json({
            success: true,
            projectPath: projectDir,
            instructions: {
                setup: [
                    `cd ${projectDir}`,
                    'npm install',
                    'npm run install:all',
                    'npm run dev'
                ]
            }
        })

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { 
                error: 'Failed to generate project',
                details: error instanceof Error ? error.message : 'Unknown error'
            }, 
            { status: 500 }
        )
    }
}