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
import { jwtAuthts , jwtAuthdjango} from '@/app/scripts/Auth/jwt'
import path from 'path'
import fs from 'fs/promises'
import { installDjangoDependencies } from '@/app/scripts/backend/django'
import { setupNextAuth } from '@/app/scripts/Auth/nextAuth'
import { setupPassport } from '@/app/scripts/Auth/passport'
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

            case 'django':
                await installDjangoDependencies(projectDir);

            case 'vue':
                await createVueJS(config, projectDir,emitLog)
            case 'vue-ts':

                await createVueTS(config, projectDir,emitLog)

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
            case 'django':
                await installDjangoDependencies(projectDir);
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
        switch (config.backend) {
            case 'express-ts':
                await jwtAuthts(config, projectDir,emitLog);
                break;
            case 'express':
                 await jwtAuthts(config,projectDir,emitLog);
                break;
            case 'django':
                await jwtAuthdjango(config, projectDir,emitLog);
                break;
            default:
                break;
        }
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

async function configureDjangoFiles(projectPath: string) {

    const settingsPath = path.join(projectPath, 'core', 'settings.py');
    const urlsPath = path.join(projectPath, 'core', 'urls.py');
    
    try {

        let settingsContent = await fs.readFile(settingsPath, 'utf8');
        const restFrameworkSettings = `

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
`;
        const installedAppsIndex = settingsContent.indexOf('INSTALLED_APPS');
        const insertPosition = settingsContent.indexOf(']', installedAppsIndex) + 1;
        settingsContent = 
            settingsContent.slice(0, insertPosition) + 
            restFrameworkSettings + 
            settingsContent.slice(insertPosition);
        
        await fs.writeFile(settingsPath, settingsContent, 'utf8');

        let urlsContent = await fs.readFile(urlsPath, 'utf8');
        const newUrlsContent = `from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', 
         jwt_views.TokenObtainPairView.as_view(), 
         name='token_obtain_pair'),
    path('api/token/refresh/', 
         jwt_views.TokenRefreshView.as_view(), 
         name='token_refresh'),
    path('', include('main.urls')),
]
`;
        await fs.writeFile(urlsPath, newUrlsContent, 'utf8');

    } catch (error) {
        console.error('Error configuring Django files:', error);
        throw error;
    }
}

