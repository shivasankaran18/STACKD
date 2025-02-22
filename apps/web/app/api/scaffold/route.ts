import { NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createReactTS } from '@/app/scripts/frontend/reactts'
import { createReactJS } from '@/app/scripts/frontend/reactjs'
import { createExpressTS } from '@/app/scripts/backend/expressts'
import { createExpressJS } from '@/app/scripts/backend/expressjs'

import { setupPrisma } from '@/app/scripts/orms/prismaSetup'
import { installDjangoDependencies } from '@/app/scripts/backend/django'

import { createVueJS } from '@/app/scripts/frontend/vuejs'
import { createVueTS } from '@/app/scripts/frontend/vuets'
import { jwtAuth } from '@/app/scripts/Auth/jwt'


export async function POST(req: NextRequest) {
    try {
        const config = await req.json()
        console.log(config)
        const projectDir = join(config.projectPath, config.projectName)

        await mkdir(projectDir, { recursive: true })
    
        
        switch(config.frontend) {
            case 'react-ts':
                await createReactTS(config, projectDir)
                break
            case 'react':
                await createReactJS(config, projectDir)
                break

            case 'django':
                await installDjangoDependencies(projectDir);

            case 'vue':
                await createVueJS(config, projectDir)
            case 'vue-ts':
                await createVueTS(config, projectDir)

                break
            default:
                throw new Error(`Unsupported frontend: ${config.frontend}`)
        }

        switch(config.backend) {
            case 'express-ts':
                await createExpressTS(config, projectDir)
                break
            case 'express':
                console.log("Creating the backend")
                await createExpressJS(config, projectDir)
                break
            case 'django':
                await installDjangoDependencies(projectDir);
                break
            default:
                throw new Error(`Unsupported backend: ${config.backend}`)
        }

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

        // await writeFile(
        //     join(projectDir, '.gitignore'),
        //     gitignore.trim()
        // )
        await jwtAuth(config,projectDir);
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