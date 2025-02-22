import { NextRequest, NextResponse } from 'next/server'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createReactTS } from '@/app/scripts/frontend/reactts'
import { createReactJS } from '@/app/scripts/frontend/reactjs'
import { createExpressTS } from '@/app/scripts/backend/expressts'
import { createExpressJS } from '@/app/scripts/backend/expressjs'
import { createVueJS } from '@/app/scripts/frontend/vuejs'
import { createVueTS } from '@/app/scripts/frontend/vuets'
import { jwtAuth } from '@/app/scripts/Auth/jwt'
import { setupNextAuth } from '@/app/scripts/Auth/nextAuth'
import { setupPassport } from '@/app/scripts/Auth/passport'
import { setupPrisma } from '@/app/scripts/orms/prismaSetup'
import { setupDrizzle } from '@/app/scripts/orms/drizzleSetup'
import { setupMongoose } from '@/app/scripts/orms/mongoSetup'
export async function POST(req: NextRequest) {
    try {
        const config = await req.json()
        console.log(config)
        const projectDir = join(config.projectPath, config.projectName)

        await mkdir(projectDir, { recursive: true })
        const emitLog = (message: string) => {
            console.log(`[Emit Logs]: ${message}`);
        };
        
        switch(config.frontend) {
            case 'react-ts':
                await createReactTS(config, projectDir,emitLog)
                break
            case 'react':
                await createReactJS(config, projectDir,emitLog)
                break
            case 'vue':
                await createVueJS(config, projectDir,emitLog)
            case 'vue-ts':
                await createVueTS(config, projectDir,emitLog)
                break
            default:
                throw new Error(`Unsupported frontend: ${config.frontend}`)
        }

        switch(config.backend) {
            case 'express-ts':
                await createExpressTS(config, projectDir,emitLog)
                break
            case 'express':
                console.log("Creating the backend")
                await createExpressJS(config, projectDir,emitLog)
                break
            default:
                throw new Error(`Unsupported backend: ${config.backend}`)
        }

        switch(config.authentication) {
            case 'jwt':
                await jwtAuth(config, projectDir,emitLog);
                break
            case 'nextauth':
                await setupNextAuth(config, projectDir,emitLog);
                break
            case 'passport':
                    await setupPassport(config, projectDir,emitLog);
                break
            default:
                throw new Error(`Unsupported auth: ${config.authentication}`) 
        }
        switch(config.orm) {
            case 'drizzle':
                await setupDrizzle(config, projectDir,emitLog);
                break
            case 'prisma':
                await setupPrisma(config, projectDir,emitLog);
                break
            case 'mongoose':
                await setupMongoose(config, projectDir,emitLog);
                break
            default:
                throw new Error(`Unsupported orm: ${config.orm}`)
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

        await jwtAuth(config,projectDir,emitLog);
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