import { join } from 'path';
import { createReactTS } from '../scripts/frontend/reactts.js';
import { createReactJS } from '../scripts/frontend/reactjs.js';
import { createVueTS } from '../scripts/frontend/vuets.js';
import { createVueJS } from '../scripts/frontend/vuejs.js';
import { createExpressTS } from '../scripts/backend/expressts.js';
import { createExpressJS } from '../scripts/backend/expressjs.js';
import { installDjangoDependencies } from '../scripts/backend/django.js';
import { setupPrisma } from '../scripts/orms/prismaSetup.js';
import { setupDrizzle } from '../scripts/orms/drizzleSetup.js';
import { setupMongoose } from '../scripts/orms/mongoSetup.js';
import { setupNextAuth } from '../scripts/Auth/nextAuth.js';
import { setupPassport } from '../scripts/Auth/passport.js';
import { jwtAuthts } from '../scripts/Auth/jwt.js';
import chalk from 'chalk';
import ora from 'ora';
import { mkdir } from 'fs/promises';
import { ProjectConfig } from '../cli.js';
import { setupShadcn } from '../scripts/ui/shadcn.js';
import { setupTailwindCSS } from '../scripts/ui/tailwindcss.js';

const emitLog = (message: string): void => {
  console.log(`[Emit Logs]: ${message}`);
};

export async function createProject(projectName: string, options: ProjectConfig) {
  const spinner = ora('Creating project...').start();
  console.log(options);
  console.log(projectName);
  try {
    const projectDir = join(options.projectPath, projectName);
    const config = {
      projectName,
      projectPath: options.projectPath,
      frontendPort: options.frontendPort,
      backendPort: options.backendPort,
      dbUrl: options.dbUrl,
    };

    // Create project directory
    await mkdir(projectDir, { recursive: true });
    
    // Frontend setup
    spinner.text = 'Setting up frontend...';
    switch(options.frontend) {
      case 'React + TypeScript':
        await createReactTS(config, projectDir, emitLog);
        break;
      case 'React (JavaScript)':
        await createReactJS(config, projectDir, emitLog);
        break;
      case 'Vue + TypeScript':
        await createVueTS(config, projectDir, emitLog);
        break;
      case 'Vue (JavaScript)':
        await createVueJS(config, projectDir, emitLog);
        break;
      case 'Django Templates':
        // Django templates will be handled with backend setup
        break;
      case 'Skip':
        emitLog('Skipping frontend setup');
        break;
      default:
        emitLog('Unknown frontend choice');
        break;
    }

    // UI Framework setup
    if (options.ui !== 'None' && options.frontend !== 'Django Templates' && options.frontend !== 'Skip') {
      spinner.text = 'Setting up UI framework...';
      switch(options.ui) {
        case 'Tailwind CSS':
          await setupTailwindCSS(config, projectDir, emitLog);
          break;
        case 'shadcn/ui + Tailwind':
          await setupTailwindCSS(config, projectDir, emitLog);
          // @ts-ignore
          await setupShadcn(config, projectDir, emitLog);
          break;
        default:
          emitLog('Unknown UI framework choice');
          break;
      }
    }

    // Backend setup
    spinner.text = 'Setting up backend...';
    switch(options.backend) {
      case 'Express + TypeScript':
        await createExpressTS(config, projectDir,emitLog);
        break;
      case 'Express (JavaScript)':
        await createExpressJS(config, projectDir,emitLog);
        break;
      case 'Django':
        await installDjangoDependencies(projectDir);
        break;
      case 'Skip':
        emitLog('Skipping backend setup');
        break;
      default:
        emitLog('Unknown backend choice');
        break;
    }

    // Database & ORM setup
    if (options.database !== 'Skip') {
      spinner.text = 'Setting up database and ORM...';
      
      // Set up ORM based on database choice
      if (options.orm !== 'Skip') {
        switch(options.orm) {
          case 'Prisma':
            await setupPrisma(config, projectDir,emitLog);
            break;
          case 'Drizzle':
            await setupDrizzle(config, projectDir,emitLog);
            break;
          case 'Mongoose':
            await setupMongoose(config, projectDir,emitLog);
            break;
          default:
            emitLog('Unknown ORM choice');
            break;
        }
      }
    }

    // Authentication setup
    if (options.auth !== 'Skip') {
      spinner.text = 'Setting up authentication...';
      switch(options.auth ) {
        case 'JWT':
          await jwtAuthts(config, projectDir,emitLog);
          break;
        // case 'NextAuth':
        //   await setupNextAuth(config, projectDir,emitLog);
        //   break;
        case 'Passport':
          await setupPassport(config, projectDir,emitLog  );
          break;
        default:
          emitLog('Unknown authentication choice');
          break;
      }
    }

    spinner.succeed(chalk.green('Project created successfully!'));
    

    console.log('\nTo get started:');
    console.log(chalk.cyan(`  cd ${projectName}`));
    
    // Add specific instructions based on choices
    if (options.frontend !== 'Skip' || options.backend !== 'Skip') {
      // console.log(chalk.cyan('  npm install'));
      
      if (options.frontend === 'Django Templates' || options.backend === 'Django') {
        console.log(chalk.cyan('  python manage.py runserver'));
      } else {
        console.log(chalk.cyan('  npm run dev'));
      }
    }

    // Add UI-specific instructions
    if (options.ui !== 'None') {
      console.log(chalk.yellow('\nUI Framework Setup:'));
      if (options.ui === 'Tailwind CSS') {
        console.log(chalk.cyan('  Tailwind CSS is ready to use'));
      } else if (options.ui === 'shadcn/ui + Tailwind') {
        console.log(chalk.cyan('  Run `npx shadcn-ui@latest init` to complete shadcn/ui setup'));
      }
    }

    // Add database specific instructions
    if (options.database !== 'Skip') {
      console.log(chalk.yellow('\nDatabase Setup:'));
      if (options.orm === 'Prisma') {
        console.log(chalk.cyan('  npx prisma generate'));
        console.log(chalk.cyan('  npx prisma migrate dev'));
      } else if (options.orm === 'Mongoose') {
        console.log(chalk.cyan('  Make sure MongoDB is running'));
      }
    }
    
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(error);
    process.exit(1);
  }
}