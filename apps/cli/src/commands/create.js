import { join } from 'path';
import { createReactTS } from '../generators/frontend/reactts.js';
import { createReactJS } from '../generators/frontend/reactjs.js';
import { createVueTS } from '../generators/frontend/vuets.js';
import { createVueJS } from '../generators/frontend/vuejs.js';
import { createExpressTS } from '../generators/backend/expressts.js';
import { createExpressJS } from '../generators/backend/expressjs.js';
import { installDjangoDependencies } from '../generators/backend/django.js';
import { setupPrisma } from '../generators/orm/prismaSetup.js';
import { setupDrizzle } from '../generators/orm/drizzleSetup.js';
import { setupMongoose } from '../generators/orm/mongoSetup.js';
import { setupNextAuth } from '../generators/auth/nextAuth.js';
import { setupPassport } from '../generators/auth/passport.js';
import { jwtAuthts } from '../generators/auth/jwt.js';
import chalk from 'chalk';
import ora from 'ora';
import { mkdir } from 'fs/promises';

const emitLog = (message) => {
  console.log(`[Emit Logs]: ${message}`);
};

export async function createProject(projectName, options) {
  const spinner = ora('Creating project...').start();
  
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