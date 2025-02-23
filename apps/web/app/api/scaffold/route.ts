import { NextRequest, NextResponse } from 'next/server'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { createReactTS } from '../../../../../packages/scripts/frontend/reactts'
import { createReactJS } from '../../../../../packages/scripts/frontend/reactjs'
import { createExpressTS } from '../../../../../packages/scripts/backend/expressts'
import { createExpressJS } from '../../../../../packages/scripts/backend/expressjs'
import { setupPrisma } from '../../../../../packages/scripts/orms/prismaSetup'
import { createVueJS } from '../../../../../packages/scripts/frontend/vuejs'
import { createNextJS } from '../../../../../packages/scripts/frontend/nextjs'
import { createVueTS } from '../../../../../packages/scripts/frontend/vuets'
import { jwtAuthts , jwtAuthdjango} from '../../../../../packages/scripts/Auth/jwt'
import path from 'path'
import fs from 'fs/promises'
import { installDjangoDependencies } from '../../../../../packages/scripts/backend/django'
import createAngularTS from '../../../../../packages/scripts/frontend/angularts'
import { setupNextAuth } from '../../../../../packages/scripts/Auth/nextAuth'
import { setupPassport } from '../../../../../packages/scripts/Auth/passport'
import { setupMongoose } from '../../../../../packages/scripts/orms/mongoSetup'
import { setupDrizzle } from '../../../../../packages/scripts/orms/drizzleSetup'
import { setupTailwindCSS } from '../../../../../packages/scripts/ui/tailwindcss'
import { setupShadcn } from '../../../../../packages/scripts/ui/shadcn'
import simpleGit from 'simple-git'




const encoder = new TextEncoder();

export async function POST(req: NextRequest) {
    try {
        const config = await req.json()
        
        console.log(config)
        const projectDir = join(config.projectPath, config.projectName)
        await mkdir(projectDir, { recursive: true })
        const git = simpleGit(projectDir);
        git.init()
            .then(() => console.log('Initialized a new Git repository'))
            .catch(err => console.error('Error:', err));

        if(config.giturl) {
            await git.remote(['add', 'origin', config.giturl]).then(() => console.log('Remote added')).catch(err => console.error('Error:', err));
        }
        const emitLog = (message: string) => {
            console.log(`[Emit Logs]: ${message}`);
            global.logs = global.logs || [];
            global.logs.push(message);
        };
        
        switch(config.frontend) {
            case 'react-ts':
                await createReactTS(config, projectDir,emitLog)
                break
            case 'react':
                await createReactJS(config, projectDir,emitLog)
                break
            case 'nextjs':
                await createNextJS(config, projectDir, emitLog);
                break;
            case 'django':
                await installDjangoDependencies(projectDir);
                break;
            case 'vue':
                await createVueJS(config, projectDir,emitLog)
                break
            case 'vue-ts':
                await createVueTS(config, projectDir,emitLog)
                break
            case 'angularts':
                await createAngularTS(config, projectDir)
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
            case 'nextjs':
                await createNextJS(config, projectDir, emitLog);
                break;
            default:
                throw new Error(`Unsupported backend: ${config.backend}`)
        }

        switch(config.auth) {
            case 'jwt':
                await jwtAuthts(config, projectDir,emitLog);
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
        switch(config.ui) {
            case 'tailwind':
                await setupTailwindCSS(config, projectDir,emitLog);
                break;
            case 'shadcn':
                await setupTailwindCSS(config, projectDir,emitLog);
                await setupShadcn(config, projectDir,emitLog);
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

export async function GET() {
    const stream = new ReadableStream({
        start(controller) {
            const interval = setInterval(() => {
                if (global.logs?.length) {
                    const log = global.logs.shift();
                    const data = `data: ${log}\n\n`;
                    controller.enqueue(encoder.encode(data));
                }
            }, 100);

            return () => clearInterval(interval);
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
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

